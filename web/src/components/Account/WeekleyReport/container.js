// Import from packages
import React, { Component } from 'react';
import { translate } from 'react-i18next';
import moment from 'moment';

// Import from internal parts
import dataService from 'services/Data';
import authService from 'services/Auth';

// Import UI
import WeekleyReportUI from './ui';

/**
 * Container component for account activity.
 *
 * Weekley report
 *
 * Provides exact data to be displayed to {@link WeekleyReportUI} component.
 *
 * @extends {Component}
 */
class WeekleyReportContainer extends Component {
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
    const user = authService.getUser();

    this.state = {
      airhackList: [],
      userList: [],
      user_id: user.id,
      isAdmin: authService.hasRole('ADMIN')
    };

    this._fetchAndUpdateUsersData();
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

  _fetchAndUpdateUsersData = async () => {
    if(this.state.isAdmin){
      try
      {
        const users_raw = await dataService.get('accounts/users');
        const users_display = users_raw.map(user => {
          return { value: user.id, label: user.first_name + ' ' + user.last_name };
        });
        this.setState({ userList: users_display});
      }catch(ex){
        console.error(ex);
      }
    }
  };


  /**
   * Wraps fetching of account-based data {@link fetchData} and error handling,
   * and sets internal state based on returned data or error.
   *
   * @param {object} account - account for which to fetch data
   */
  async _fetchAndUpdateState(account) {
    if (this.state.user_id) {
      try {
        const data = await this._fetchData(this.state.user_id);

        this.setState({
          airhackList: data.airhacks
        });
      } catch (e) {
        // TODO: handle error for real
        console.debug('Account-based airhack data fetch error', e);
      }
    }
  }

  _refresh = async event => {
    await this._fetchAndUpdateState(this.props.account);
  }


  /**
   * Fetches transaction data {@link fetchTransactions} and extracts a list of
   * service providers from airhacks.
   *
   * @param {string} memberId - id of member for which to fetch data
   * @return {Object} data
   */
  _fetchData = async memberId => {
    const airhacks = await this._fetchAirhacks(memberId);

    return { airhacks: airhacks };
  };

  /**
   * Fetches transaction data
   *
   * @param {string} memberId - id of member for which to fetch data
   * @return {Object[]} airhacks - list of airhacks for member, sorted descending by date
   * @todo add filtering in request once server-side filtering is implemented
   */
  async _fetchAirhacks(memberId) {
    /*const startDate = moment()
      .subtract(30, 'days')
      .format('YYYY-MM-DD');*/

    // add params (start date, end date)
    const params = { };
    const airhacks = await dataService.get('airhack/' + memberId + '/weekley', params);

    return airhacks;
  }

  /**
   * Toggle open state for mobile view.
   *
   * Opens or closes the item in the activity list on mobile view
   *
   * @param {int} field - The index in the list
   */
  _toggleMobileOpen = index => {
    const list = this.state.transactionList;

    list[index].mobile_open = !list[index].mobile_open;

    this.setState({ transactionList: list });
  };

  _userChange = (event) => {
    if (event && event.target && event.target.value) {
      this.setState({ user_id: event.target.value });
    }

    if (event && event.value) {
      this.setState({ user_id: event.value });
    }
  }


  /**
   * Filters transaction data and renders {@link AccountActivityUI} component
   * @todo remove filtering once it is implemented on backend
   */
  render() {
    const {
      airhackList,
      userList,
      user_id
    } = { ...this.state };

    return (
      <WeekleyReportUI
        airhackList={airhackList}
        toggleMobileOpen={this._toggleMobileOpen}
        renderArrow={this._renderArrow}
        userList={userList}
        datesChange={this._datesChange}
        userChange={this._userChange}
        user_id={user_id}
        refresh = { this._refresh }
        isAdmin={this.state.isAdmin}

      />
    );
  }
}

export default translate('account.weekley_report')(WeekleyReportContainer);
