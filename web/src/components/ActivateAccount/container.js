// Import from packages
import React, { Component } from 'react';

// Import UI
import ActivateAccountUI from './ui.js';
import dataService from 'services/Data';
/**
 * Container component for login
 *
 * Handles login procedure and sends user forward to the Dashboard
 *
 * @extends {Component}
 */
class ActivateContainer extends Component {
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
      activated: false,
      failed: false,
    };
  }

    async componentDidMount() {
      const code = this.props.match.params.code;

      if (code){
        try{
          await dataService.post('accounts/users/activation', { code:code });
          this.setState({activated: true});
        }
        catch(ex){
          this.setState({failed: true});
        }
      }
  }



  /**
   * Renders {@link LoginUI} component
   */
  render() {
    return (
      <ActivateAccountUI
        activated={this.state.activated}
        failed={this.state.failed}
      />
    );
  }
}

export default ActivateContainer;
