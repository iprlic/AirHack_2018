const jwt_decode = require('jwt-decode');

/**
 * Service for authentication
 *
 * Manages login to and logout from the system.
 */

let _isAuth;
let _accessToken;
let _refreshToken;
let _user;
let _expiresAt;

const ClientId = process.env.OAUTH_CLIENT_ID;
const ServerRoot = process.env.OAUTH_SERVER_ROOT;

class AuthService {
  /**
   * Attempts to read the user ID from localStorage and sets isAuth as appropriate
   */
  constructor() {

    const user = JSON.parse(localStorage.getItem('user'));
    const accessToken = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');
    const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    console.log(user);
    if (user) {
      _isAuth = true; //TODO: depends on expires at
      _user = user;
      _accessToken = accessToken;
      _refreshToken = refreshToken;
      _expiresAt = expiresAt;
    } else {
      this.logout();
    }
  }

  /**
   * Make actual auth request
   *
   * @param {string} params - Parameters to send in the request
   * @return {string} userId - The logged in user's ID
   */
  async _makeAuthRequest(params) {
    const url = `${ServerRoot}/token${params}`;
    const options = {
      method: 'GET'
    };

    try {
      const response = await fetch(url, options);
      const json = await response.json();
      const throwObj = {};

      // Some HTTP status handling, as fetch does not necessarily think this is an error
      if (response.status === 401) {
        throwObj.status = 401;
        throwObj.error = 'INVALID_CREDENTIALS';
        throw throwObj;
      } else if (response.status === 400) {
        throwObj.status = 401;
        throwObj.error = json.error;
        throwObj.message = json.error_description;
        throw throwObj;
      }

      // extract user data from successful response
      const decoded = jwt_decode(json.access_token);
      _isAuth = true;
      _user = decoded.user;
      _accessToken = json.access_token;
      _refreshToken = json.refresh_token;
      _expiresAt = decoded.exp * 1000;
      this.setSession(decoded, _accessToken, _refreshToken);

      return decoded.user;
    } catch (err) {
      if (err.error) {
        throw err;
      } else {
        console.debug('Network error:', err);
      }
    }
  }

  /**
   * Log in user
   *
   * @param {string} username - Username
   * @param {string} password - Password
   * @return {string} userId - The logged in user's ID
   */
  async login(username, password) {
    const params = `?grant_type=password&client_id=${ClientId}&username=${username}&password=${password}`;
    return await this._makeAuthRequest(params);
  }

  /**
   * Log out user
   */
  logout() {
    _isAuth = false;
    _user = undefined;
    _accessToken = undefined;
    _refreshToken = undefined;
    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('expires_at');
  }

  /**
   * Save user data tolocal storage
   *
   * @param authResult
   * @param accessToken
   * @param refreshToken
   */
  setSession(authResult, accessToken, refreshToken) {
    // Set the time that the access token will expire at
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
    localStorage.setItem('user', JSON.stringify(authResult.user));
    localStorage.setItem('expires_at', JSON.stringify(authResult.exp * 1000));
  }

  /**
   * Refresh user token
   *
   * @return {string} The logged in user's ID
   */
  async refreshToken() {
    const params = `?grant_type=refresh_token&client_id=${ClientId}&refresh_token=${_refreshToken}`;
    await this._makeAuthRequest(params);
  }

  /**
   * Get user access token
   *
   * @return {string} The logged in user's access token
   */
  getToken() {
    return _accessToken;
  }

  /**
   * Get user
   *
   * @return {string} The logged in user
   */
  getUser() {
    return _user;
  }

  /**
   * Check if user had a specific role
   * @param  {[type]}  role [description]
   * @return {Boolean}      [description]
   */
  hasRole(role) {
    return _user.roles.filter(r => { return r.name === role; }).length > 0;
  }

  /**
   * Check if user is authenticated
   *
   * @return {Boolean} If the user is authenticated or not
   */
  isAuth() {
    return _isAuth && new Date().getTime() < _expiresAt;
  }


}

const authService = new AuthService();

export default authService;
