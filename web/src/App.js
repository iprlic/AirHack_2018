import React, { Component } from 'react';
import { Router, Route, Switch } from 'react-router-dom';

import AuthorizedRoute from 'components/Authorized/AuthorizedRoute.js';

import LoginContainer from 'components/Login/container.js';
import AccountContainer from 'components/Account/container.js';
import ActivateAccountContainer from 'components/ActivateAccount/container.js';
import ForgotPassContainer from 'components/ForgotPassword/container.js';
import RegisterContainer from 'components/Register/container.js';
import PasswordResetContainer from 'components/PasswordReset/container.js';

import dataService from 'services/Data';
import authService from 'services/Auth.js';
import history from 'history.js';

dataService.setAuthProvider(authService);

class App extends Component {
  render = () => {
    return (
      <Router history={history}>
        <div>
          <Switch>
            <Route path="/login" component={LoginContainer} />
            <Route path="/forgotpass" component={ForgotPassContainer} />
            <Route path="/register" component={RegisterContainer} />
            <Route path="/activate/:code" component={ActivateAccountContainer} />
            <Route path="/reset_pass/:code" component={PasswordResetContainer} />
            <AuthorizedRoute
              path="/"
              component={AccountContainer}
              authProvider={authService}
              loginUrl="/login"
            />
          </Switch>
        </div>
      </Router>
    );
  };
}

export default App;
