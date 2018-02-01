// Import from packages
import React, { Component } from 'react';

// Import from internal parts
import history from 'history.js';
import authService from 'services/Auth.js';

// Import UI
import LoginUI from './ui.js';

/**
 * Container component for login
 *
 * Handles login procedure and sends user forward to the Dashboard
 *
 * @extends {Component}
 */
class LoginContainer extends Component {
  /**
   * @override
   *
   * Sets initial component state.
   *
   * Note that data passed from parent may be empty at this moment, as it
   * is fetched asynchronously.
   *
   * @param {Object} props - properties received from parent component
   */
  constructor(props) {
    super(props);

    this.state = {
      focused: {
        mail: false,
        pass: false
      },
      error: 0,
      showPass: false
    };
  }

  /**
   * Toggles focus for selected field
   *
   * @param {string} field - The field where the focus should be changed
   * @param {SytheticEvent} event - A React synthetic event {@see https://reactjs.org/docs/events.html}
   */
  _toggleFocused = (field, event) => {
    const focused = this.state.focused;
    focused[field] = !focused[field];
    this.setState({ focused: focused });
  };

  /**
   * Toggles if the password should e shown or not
   */
  _toggleShowPass = () => {
    this.setState({ showPass: !this.state.showPass });
  };

  /**
   * Handle login of user
   *
   * @param {SytheticEvent} event - A React synthetic event {@see https://reactjs.org/docs/events.html}
   * @param {string} event.target.username.value - The username the user entered
   * @param {string} event.target.password.value - The password the user entered
   */
  handleLogin = async event => {
    event.preventDefault();

    const [username, password] = [event.target.username.value, event.target.password.value];

    try {
      await authService.login(username, password);
      this.setState({ error: 0 });
      history.push('/');
    } catch (e) {
      this.setState({ error: e.status });
    }
  };

  /**
   * Renders {@link LoginUI} component
   */
  render() {
    return (
      <LoginUI
        login={this.handleLogin}
        focused={this.state.focused}
        error={this.state.error}
        toggleFocused={this._toggleFocused}
        showPass={this.state.showPass}
        toggleShowPass={this._toggleShowPass}
      />
    );
  }
}

export default LoginContainer;
