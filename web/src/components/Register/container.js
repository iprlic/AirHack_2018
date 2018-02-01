// Import from packages
import React, { Component } from 'react';

// Import UI
import RegisterUI from './ui.js';
import dataService from 'services/Data.js';
/**
 * Container component for registering
 *
 * Handles registering procedure
 *
 * @extends {Component}
 */
class RegisterContainer extends Component {
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
        first_name: false,
        last_name: false,
        mail: false,
        pass: false
      },
      error: {
        mail: false
      },
      mailSent: false,
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
   * Removes errors from a field when it's changed
   *
   * @param {string} field - The field where the errors should be removed
   * @param {SytheticEvent} event - A React synthetic event {@see https://reactjs.org/docs/events.html}
   */
  _unsetError = (field, event) => {
    const error = this.state.error;
    error[field] = false;
    this.setState({ error: error });
  };

  /**
   * Toggles if the password should e shown or not
   */
  _toggleShowPass = () => {
    this.setState({ showPass: !this.state.showPass });
  };

  /**
   * Handle registration of user
   *
   * @param {SytheticEvent} event - A React synthetic event {@see https://reactjs.org/docs/events.html}
   * @param {string} event.target.username.value - The username the user entered
   */
  register = async event => {
    event.preventDefault();

    const [first_name, last_name, email, password] = [event.target.first_name.value, event.target.last_name.value, event.target.email.value, event.target.password.value];

    try {
      await dataService.post('accounts/users', {
        first_name: first_name,
        last_name: last_name,
        email: email,
        password: password
      });

      this.setState({ mailSent: true });
    } catch (e) {
      this.setState({ error: e.status });
    }
  };

  /**
   * Renders {@link LoginUI} component
   */
  render() {
    return (
      <RegisterUI
        register={this.register}
        focused={this.state.focused}
        error={this.state.error}
        toggleFocused={this._toggleFocused}
        unsetError={this._unsetError}
        mailSent={this.state.mailSent}
        showPass={this.state.showPass}
        toggleShowPass={this._toggleShowPass}
      />
    );
  }
}

export default RegisterContainer;
