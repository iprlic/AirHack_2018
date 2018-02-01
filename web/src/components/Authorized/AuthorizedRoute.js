import React from 'react';

import { Route, Redirect } from 'react-router-dom';

const AuthorizedRoute = ({ component: Component, authProvider, loginUrl, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props =>
        authProvider.isAuth() ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: loginUrl,
              state: { from: props.location }
            }}
          />
        )}
    />
  );
};

export default AuthorizedRoute;
