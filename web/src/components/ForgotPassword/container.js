// Import from packages
import React, { Component } from 'react';

// Import UI
import ForgotPasswordUI from './ui.js';

import dataService from 'services/Data.js';

/**
 * Container component for login
 *
 * Handles login procedure and sends user forward to the Dashboard
 *
 * @extends {Component}
 */
class ForgotPassContainer extends Component {
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
      email: null,
      focused: {
        mail: false
      },
      error: {
        mail: false
      },
      mailSent: false
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

    if(event && event.target && event.target.value){
      this.setState({ email: event.target.value });
    }
    this.setState({ error: error });
  };

  /**
   * Handle login of user
   *
   * @param {SytheticEvent} event - A React synthetic event {@see https://reactjs.org/docs/events.html}
   * @param {string} event.target.username.value - The username the user entered
   */
  resetPass = async event => {
    event.preventDefault();

    try{
      await dataService.post('accounts/users/forgot_password', { email: this.state.email })
      this.setState({ mailSent: true });
    }catch(err){
      this.setState({ error: {mail: 'Error occured!'}});
    }
  };

  /**
   * Renders {@link LoginUI} component
   */
  render() {
    return (
      <ForgotPasswordUI
        reset={this.resetPass}
        focused={this.state.focused}
        error={this.state.error}
        toggleFocused={this._toggleFocused}
        unsetError={this._unsetError}
        mailSent={this.state.mailSent}
      />
    );
  }
}

export default ForgotPassContainer;
