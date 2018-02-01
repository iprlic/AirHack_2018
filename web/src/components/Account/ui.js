// Import from packages
import React from 'react';
import { Route } from 'react-router-dom';

// Import from internal parts
import DashboardContainer from './Dashboard/container';
import NavigationContainer from './Navigation/container';
import ProfileContainer from './Profile/container';
import WeekleyReportContainer from './WeekleyReport/container';
import UsersContainer from './Users/container';


/**
 * User interface for Account component
 *
 * Passes {@link AccountContainer#updateAccountData} for updating user and
 * member data.
 *
 * @param {Object} param - Object parameter
 * @param {Object} param.account - Account for current user
 * @param {AccountContainer#updateAccountData(accountData: Object)} param.update - Method for updating account data
 * @return The component HTML template
 */
const AccountUI = ({ account, update }) => {
  return (
    <div>
      <NavigationContainer />

      <Route exact path="/" render={() => <DashboardContainer account={account} />} />
      <Route
        path="/weekley"
        render={() => <WeekleyReportContainer account={account} />}
      />
      <Route
        path="/users"
        render={() => <UsersContainer account={account} />}
      />
      <Route
        path="/profile"
        render={() => <ProfileContainer account={account} update={update} />}
      />
    </div>
  );
};

export default AccountUI;
