import history from 'history.js';

/**
 * Service for API calls
 *
 * Manages login to and logout from the system.
 */
let _authProvider = {};
class DataService {
  /**
   * Represents a dataService object.
   *
   * @constructor
   * @param {string} apiUrl - The URL to the API
   */
  constructor(apiUrl) {
    this._initialize(apiUrl);
  }

  setAuthProvider(authProvider) {
    _authProvider = authProvider;
  }

  /**
   * Public interface allowing to override _all_ the parameters - should not be
   * used in most cases, but is provided as an emergency option if other data
   * access methods prove to be inadequate and modifying them for an edge case
   * does not make sense.
   *
   * @param {string} url - The URL for fetching
   * @param {Object} options - The options sent as headers
   * @return {Promise} Promise object with fetched data
   */
  async fetch(url, options = {}) {
    return this._fetch(url, options);
  }

  /**
   * Public method for making get requests. Received params are from application
   * perspective, not fetch or JSON API - this method normalizes and transforms
   * parameters from app-level standard to fetch API and JSON standards used.
   * Supplied path param is relative to API url, which is set during creation
   * of instance..
   *
   * @param {string} path - The path to the correct endpoint relative to API root
   * @param {Object} params - Params that should be added to path
   * @return {Promise} Promise object with fetched data
   */
  async get(path, params = {}) {
    const urlParamString = this._extractUrlParamString(params);

    const url =
      urlParamString !== ''
        ? `${this.config.apiUrl}/${path}?${urlParamString}`
        : `${this.config.apiUrl}/${path}`;

    const options = this._getFetchOptions();
    options.method = 'GET';

    console.log('options', options);
    console.log('url', url)

    return this._fetch(url, options);
  }

  /**
   * Public method for making post requests.
   *
   * @param {string} path - The path to the correct endpoint relative to API root
   * @param {Object} data - Data to be sent (optional)
   * @return {Promise} Promise object with posted data
   */
  async post(path, data = {}) {
    const url = `${this.config.apiUrl}/${path}`;

    const options = this._getFetchOptions();
    options.method = 'POST';
    options.headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(data);

    return this._fetch(url, options);
  }

  async delete(path, data = {}) {
    const url = `${this.config.apiUrl}/${path}`;

    const options = this._getFetchOptions();
    options.method = 'DELETE';
    options.headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(data);

    return this._fetch(url, options);
  }

  /**
   * Public method for making patch requests.
   *
   * @param {string} path - The path to the correct endpoint relative to API root
   * @param {Object} data - Data to be sent (optional)
   * @return {Promise} Promise object with patched data
   */
  async patch(path, data = {}) {
    if (Object.keys(data).length === 0 && data.constructor === Object) {
      return;
    }

    const url = `${this.config.apiUrl}/${path}`;
    const formattedData = this._formatPatchData(data);

    const options = this._getFetchOptions();
    options.method = 'PATCH';
    options.headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(formattedData);

    return this._fetch(url, options);
  }

  /**
   * Initialization of class object.
   *
   * @param {string} apiUrl - URL to the API
   */
  _initialize(apiUrl) {
    this.config = { apiUrl: apiUrl };
  }

  /**
   * Here we have an opportunity to map from application-specific params to API
   * and fetch-specific options. This method can be redefined/overriden if/when
   * communication interface changes; e.g. when JSON-API is implemented rather
   * than "raw" JSON communication
   *
   * @param {Object} params - Params that should be added to path
   * @return {string} All params that will be added to path
   */
  _extractUrlParamString(params) {
    const paramString = Object.keys(params)
      .map(k => `${k}=${params[k]}`)
      .join('&');

    return paramString;
  }

  /**
   * Global fetch options, such as headers, cors, auth token etc
   *
   * @return {Object} Object with global fetch options
   */
  _getFetchOptions() {
    const token = _authProvider.getToken();
    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
  }

  /**
   * "Raw" fetch method; all public methods first have to construct the wanted
   * url and params. This is basically a response handling wrapper around fetch
   * browser api.
   *
   * @param {string} url - The url to fetch
   * @param {Object} options - Options that should be sent as headers
   * @throws Will throw error if response contains HTTP error code
   * @return {Promise} Promise object with fetched data as JSON
   */
  async _fetch(url, options = {}) {
    try {
      const response = await fetch(url, options);

      // first 401 _may_ happen due to expired token, so we ask the auth
      // provider to refresh it for us and we retry
      if (response.status === 401) {
        await _authProvider.refreshToken();
        const retryResponse = await fetch(url, options);

        if (retryResponse.status === 401) {
          _authProvider.logout();
          history.push('/login');
        } else {
          const retryJson = await this._processResponse(retryResponse);
          return retryJson;
        }
      } else {
        const json = await this._processResponse(response);
        return json;
      }
    } catch (e) {
      const error = this._formatError(e);
      throw error;
    }
  }

  /**
   * Since fetch throws exception only on network-level errors, we need to
   * additionally check if in was a HTTP error status (4xx, 5xx) and act
   * accordingly
   *
   * @param {Object} response - The fetch response
   * @throws Will throw error if response contains HTTP error code
   * @return {Promise} Promise object with fetched data
   */
  async _processResponse(response) {
    if (response.ok) {
      if(response.status !== 204){
        return await this._HTTPsuccess(response);
      }else{
        return {};
      }
    } else {
      const error = this._HTTPError(response);
      throw error;
    }
  }

  /**
   * Entry point to format all success reponses as needed
   *
   * @param {Object} response - The fetch response
   * @return {Promise} Promise object with fetched data as JSON
   */
  async _HTTPsuccess(response) {
      return await response.json();
  }

  /**
   * Entry point to format all HTTP error reponses as needed
   *
   * @param {Object} response - The fetch response
   * @return {Object} Error object
   */
  async _HTTPError(response) {
    const error = {};
    // 401 is the special case

    if (response.status === 401) {
      error.error = 'NOT_AUTHORIZED';
    } else if (response.status < 500) {
      error.error = 'BAD_REQUEST';
    } else {
      error.error = 'SERVER_ERROR';
    }

    return error;
  }

  /**
   * Catch-all handler for all errors; last chance to format errors
   *
   * @param {Object} error - The error to be formatted
   * @return {Object} Error object
   */
  _formatError(error) {
    console.debug(error);

    // HTTP level errors already have the error key set.
    // App level errors are not defined yet, but will also have the key set.
    // Not having the error key indicates network-level error from fetch; for
    // now we just make it a generic error
    const formattedError = error.error ? error : { error: 'NETWORK_ERROR' };

    return formattedError;
  }

  /**
   * We need to format patch data from an object to an array containing patch
   * objects.
   *
   * Each patch object in the return array must have the keys op, path and value.
   *
   * @param {Object} data - The data to be formatted for patch
   * @return {Object[]} Array with objects containing the formatted patch data
   */
  _formatPatchData(data) {
    return Object.keys(data).map(value => {
      return {
        op: 'replace',
        path: '/' + value,
        value: data[value]
      };
    });
  }
}

const dataService = new DataService(process.env.API_URL);

export default dataService;
