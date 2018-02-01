// Import from packages
import React from 'react';
import { I18n } from 'react-i18next';
import Mail from 'react-icons/lib/fa/envelope';
import Excl from 'react-icons/lib/fa/exclamation-circle';
import { Link } from 'react-router-dom';

// Import from internal parts
import OutsideNavigationContainer from '../OutsideNavigation/container';

// Import styles
import './style.scss';

/**
 * [description]
 * @param  {[type]} options.activated [description]
 * @return {[type]}                   [description]
 */
const ActivateAccountUI = ({ activated, failed }) => {
  return (
    <I18n ns={['login']}>
      {(t, { i18n }) => (
        <div className="login-container">
          <OutsideNavigationContainer />
          {failed && (
            <div className="login-form-container">
              <div className="login-header">
                <div className="login-brand-logo" />
                <div className="login-welcome">Failed to activate account</div>
              </div>

            </div>
          )}
          {activated && (
            <div className="login-form-container">
              <div className="login-header">
                <div className="login-pass-reset-sent-image" />
                <div className="login-welcome">Account activated</div>
              </div>

              <div className="reset-sent-button">
                <Link className="margin-top ok-button" to="/login">
                  OK
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </I18n>
  );
};

export default ActivateAccountUI;
