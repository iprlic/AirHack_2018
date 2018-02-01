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
 * User interface for Login component
 *
 * Uses {@link LoginContainer#resetPass} for logging in
 *
 * @param {Object} param - Object parameter
 * @param {LoginContainer#resetPass(event: SytheticEvent)} param.reset - Method for sending reset link
 * @param {Object} param.focused - Contains focused status for all form fields
 * @param {Object} param.error - Contains error status for all form fields
 * @param {LoginContainer#toggleFocused(field: string, event: SytheticEvent)} param.toggleFocused - Method for setting focus to clicked element
 * @param {LoginContainer#unsetError(field: string, event: SytheticEvent)} param.unsetError - Method for removing error from changed element
 * @param {Boolean} param.mailSent - If the mail has been sent or not
 * @return The component HTML template
 */
const ForgotPasswordUI = ({ reset, focused, error, toggleFocused, unsetError, mailSent }) => {
  return (
    <I18n ns={['login']}>
      {(t, { i18n }) => (
        <div className="login-container">
          <OutsideNavigationContainer />
          {!mailSent && (
            <div className="login-form-container">
              <div className="login-header">
                <div className="login-brand-logo" />
                <div className="login-welcome">{t('forgot-page-title')}</div>
                <div className="login-message">{t('forgot-page-desc')}</div>
              </div>

              <div className="login-form">
                <form onSubmit={reset}>
                  <div
                    className={
                      'field-container' +
                      (focused.mail ? ' field-focused' : '') +
                      (error.mail ? ' field-error' : '')
                    }>
                    <div
                      className={
                        'field-left-icon' +
                        (focused.mail ? ' icon-focused' : '') +
                        (error.mail ? ' icon-error' : '')
                      }>
                      <Mail />
                    </div>
                    <div className="field-input">
                      <input
                        name="username"
                        placeholder={t('placehold-mail')}
                        type="text"
                        onFocus={toggleFocused.bind(this, 'mail')}
                        onBlur={toggleFocused.bind(this, 'mail')}
                        onChange={unsetError.bind(this, 'mail')}
                      />
                    </div>
                  </div>
                  {error.mail && (
                    <div className="field-error-message">
                      <Excl /> {t('wrong-mail')}
                    </div>
                  )}
                  <input
                    name="submit"
                    type="submit"
                    value={t('forgot-page-button')}
                    className="airhack-btn airhack-btn-main margin-top login-button"
                  />
                </form>
              </div>
            </div>
          )}
          {mailSent && (
            <div className="login-form-container">
              <div className="login-header">
                <div className="login-pass-reset-sent-image" />
                <div className="login-welcome">{t('forgot-page-sent-title')}</div>
                <div className="login-message">{t('forgot-page-sent-desc')}</div>
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

export default ForgotPasswordUI;
