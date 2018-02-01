// Import from packages
import React, { Component } from 'react';
import { translate } from 'react-i18next';
import moment from 'moment';
import { confirm } from '../../Helpers/Confirmation/container';
import { updateForm } from './UpdateForm/container';

// Import from internal parts
import dataService from 'services/Data';

// Import UI
import UsersUI from './ui';

/**
 * Container component for users list.
 *
 * Users
 *
 * Provides exact data to be displayed to {@link UsersUI} component.
 *
 * @extends {Component}
 */
class UsersContainer extends Component {
  /**
   * @override
   *
   * Sets initial component state.
   *
   * Note that data passed from parent may be empty at this moment, as it
   * is fetched asynchronously.
   *
   * @param {Object} props - properties received from parent component
   * @param {Object} props.account - currently logged in user's account
   */
  constructor(props) {
    super(props);

    this.state = {
      usersList: []
    };
  }

  /**
   * React hook which gets executed after component mounts.
   *
   * Has access to state, and therefore does not receive parameters.
   *
   * Note that on first render the state may not yet have the account data, as
   * it is fetched asynchronously from the parent. If that is the case, once
   * account data was fetched, it will be passed to {@link componentWillReceiveProps}.
   */
  async componentDidMount() {
    const account = this.props.account;
    if (Object.keys(account).length > 0) {
      this._fetchAndUpdateState(account);
    }
  }

  /**
   * React hook which gets executed when component will receive new parameters.
   *
   * Note that this method will only get executed if account data (fetched
   * asynchronously) was not available at the moment {@link componentDidMount}
   * was executed.
   *
   * @param {object} nextProps - properties received from parent component
   * @param {object} nextProps.account - currently logged in user's account
   */
  async componentWillReceiveProps(nextProps) {
    const account = nextProps.account;
    this._fetchAndUpdateState(account);
  }

  /**
   * Wraps fetching of account-based data {@link fetchData} and error handling,
   * and sets internal state based on returned data or error.
   *
   * @param {object} account - account for which to fetch data
   */
  async _fetchAndUpdateState(account) {
    if (account && account.id) {
      try {
        const data = await this._fetchData(account.id);

        this.setState({
          usersList: data.users
        });
      } catch (e) {
        // TODO: handle error for real
        console.debug('Account-based users data fetch error', e);
      }
    }
  }

  /**
   * Fetches transaction data {@link fetchTransactions} and extracts a list of
   * service providers from users.
   *
   * @param {string} memberId - id of member for which to fetch data
   * @return {Object} data
   */
  _fetchData = async memberId => {
    const users = await this._fetchUsers(memberId);

    return { users: users };
  };

  /**
   * Fetches transaction data
   *
   * @param {string} memberId - id of member for which to fetch data
   * @return {Object[]} users - list of users
   * @todo add filtering in request once server-side filtering is implemented
   */
  async _fetchUsers(memberId) {

    // add params for paggoing
    const params = { };
    const users = await dataService.get('accounts/users', params);

    return users;
  }

  /**
   * Toggle open state for mobile view.
   *
   * Opens or closes the item in the users list on mobile view
   *
   * @param {int} field - The index in the list
   */
  _toggleMobileOpen = index => {
    const list = this.state.usersList;

    list[index].mobile_open = !list[index].mobile_open;

    this.setState({ usersList: list });
  };

  _removeUser = async id => {
    return dataService.delete('accounts/users/' + id);
  }

  _remove = id => {
    confirm('Are you sure you want to delete this record?').then(async () => {
        try{
          await this._removeUser(id);
          await this._fetchAndUpdateState(this.props.account);
        } catch (e) {
          console.error('Failed to delete user', e);
        }

    }, () => {

    });
  };

  _add = () => {
      updateForm({ user:{ }, message:'New user'}).then(async (button, input) => {
        try{
          await this._fetchAndUpdateState(this.props.account);
        } catch (e) {
          console.error('Failed to create a user', e);
        }

    }, () => {

    });
  }

  _update = user => {
    updateForm({user:user, message:'Editing users'}).then(async (button, input) => {
        try{
          await this._fetchAndUpdateState(this.props.account);
        } catch (e) {
          console.error('Failed to updates user', e);
        }

    }, () => {

    });
  };


  _refresh = async event => {
    await this._fetchAndUpdateState(this.props.account);
  }

  /**
   * Filters transaction data and renders {@link AccountActivityUI} component
   */
  render() {
    const {
      usersList,
    } = { ...this.state };

    return (
      <UsersUI
        usersList={usersList}
        refresh = { this._refresh }
        update = { this._update }
        add = { this._add }
        remove = {this._remove}
        toggleMobileOpen={this._toggleMobileOpen}
        renderArrow={this._renderArrow}
      />
    );
  }
}

export default translate('account.users')(UsersContainer);
