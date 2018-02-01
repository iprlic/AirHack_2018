// Import from packages
import React, { Component } from 'react';

// Import from internal parts
import authService from 'services/Auth.js';
import dataService from 'services/Data.js';

// Import UI
import AccountUI from './ui.js';

/**
 * Container component for account
 *
 * Manages account data and updates data for the logged in account
 *
 * @extends {Component}
 */
class AccountContainer extends Component {
  /**
   * Initializes component object and sets initial component state.
   *
   */
  constructor() {
    super();
    this.state = { account: {} };
  }

  /**
   * React hook which gets executed after component mounts.
   *
   * Uses the auth service to get the current user's ID and fetches account
   * data from the API.
   *
   */
  async componentDidMount() {
    const user = authService.getUser();

    try {
      const account = await this._fetchAccount(user.id);

      this.setState({ account: account });
    } catch (e) {
      console.debug('Data fetch error:', e);
    }
  }

  /**
   * Updates state with new account data recieved from child components.
   *
   * This is a callback function passed down to {@link UpdateFormContainer}
   * component to be used when the user changes their account information.
   *
   * @param {Object} newAccount - New account data that will be set into the state
   */
  updateAccount = async newAccount => {
    const oldAccount = { ...this.state.account };

    // Properties we can currently update for user and airhackMember
    const defaultUserKeys = ['first_name', 'last_name', 'email'];

    // Get user and airhackMember objects
    const airhackMemberData = this._preparePatchObj(
      oldAccount,
      newAccount,
      defaultUserKeys,
      {}
    );

    try {
      await dataService.patch('accounts/users/' + newAccount.id, airhackMemberData);
      this.setState({ account: { ...newAccount } });
    } catch (e) {
      console.debug('Error updating account', e);
    }
  };

  /**
   * Prepares the account data for patching.
   *
   * Takes old accaount data and compares it with new account data. Removes all
   * not updated fields.
   *
   * @param {Object} oldAccount - Old account data
   * @param {Object} newAccount - New account data for update
   * @param {string[]} defaultKeys - All keys possible for patching
   * @param {Object} pathTransformations - Any keys not same in GET and PATCH
   */
  _preparePatchObj(oldAccount, newAccount, defaultKeys, pathTransformations) {
    // All keys in the updated object
    const keys = Object.keys(newAccount);

    //Remove keys that are not updated
    const filteredKeys = keys.filter(function(key) {
      return (
        (oldAccount[key] === undefined || oldAccount[key] !== newAccount[key]) &&
        defaultKeys.indexOf(key) !== -1
      );
    });

    const returnData = filteredKeys.reduce((acc, key) => {
      if (newAccount[key] === undefined) {
        return acc;
      }

      return { ...acc, [key]: newAccount[key] };
    }, {});

    // Dirty fix for transforming keys that are not the same in GET and PATCH
    // for this object
    const returnDataTransformed = Object.keys(returnData).reduce((acc, key) => {
      if (pathTransformations[key] !== undefined) {
        return { ...acc, [pathTransformations[key]]: returnData[key] };
      }

      return { ...acc, [key]: returnData[key] };
    }, {});

    // When dirty fix above is removed, change this to "returnData"
    return returnDataTransformed;
  }

  /**
   * Fetches account data using {@link DataService#get}.
   *
   * @param {string} id - The uuid of the user for which to fetch data
   * @return {Object} - member data
   */
  async _fetchAccount(id) {
    const account = await dataService.get(`accounts/users/${id}`);

    return account;
  }

  /**
   * Renders {@link AccountUI} component
   */
  render() {
    return (
      <AccountUI
        account={this.state.account}
        update={this.updateAccount}
        logout={this.handleLogout}
      />
    );
  }
}

export default AccountContainer;
