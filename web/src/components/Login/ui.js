// Import from packages
import React from 'react';
import { I18n } from 'react-i18next';
import Mail from 'react-icons/lib/fa/envelope';
import Lock from 'react-icons/lib/fa/lock';
import Excl from 'react-icons/lib/fa/exclamation-circle';
import Check from 'react-icons/lib/fa/check';
import { Link } from 'react-router-dom';

// Import from internal parts
import OutsideNavigationContainer from '../OutsideNavigation/container';

// Import styles
import './style.scss';

/**
 * User interface for Login component
 *
 * Uses {@link LoginContainer#handleLogin} for logging in
 *
 * @param {Object} param - Object parameter
 * @param {LoginContainer#handleLogin(event: SytheticEvent)} param.login - Method for handling login
 * @param {Object} param.focused - Contains focused status for all form fields
 * @param {Object} param.error - Contains error status if credentials were not correct
 * @param {LoginContainer#toggleFocused(field: string, event: SytheticEvent)} param.toggleFocused - Method for setting focus to clicked element
 * @param {boolean} param.showPass - Determines if password should be displkayed in the field or not
 * @param {LoginContainer#toggleShowPass()} param.toggleShowPass - Method for toggling if password should be displayed
 * @return The component HTML template
 */
const LoginUI = ({ login, focused, error, toggleFocused, showPass, toggleShowPass }) => {
  return (
    <I18n ns={['login']}>
      {(t, { i18n }) => (
        <div className="login-container">
          <OutsideNavigationContainer />
          <div className="login-form-container">
            <div className="login-header">
              <div className="login-welcome">{t('page-title')}</div>
              <div className="login-message">{t('login-desc')}</div>
            </div>

            <div className="login-form">
              <form onSubmit={login}>
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
                    />
                  </div>
                </div>
                <div
                  className={
                    'field-container' +
                    (focused.pass ? ' field-focused' : '') +
                    (error.pass ? ' field-error' : '')
                  }>
                  <div
                    className={
                      'field-left-icon' +
                      (focused.pass ? ' icon-focused' : '') +
                      (error.pass ? ' icon-error' : '')
                    }>
                    <Lock />
                  </div>
                  <div className="field-input">
                    <input
                      name="password"
                      placeholder={t('placehold-pass')}
                      type={showPass ? 'text' : 'password'}
                      onFocus={toggleFocused.bind(this, 'pass')}
                      onBlur={toggleFocused.bind(this, 'pass')}
                    />
                  </div>
                </div>
                <div className="password-extra">
                  <div className="toggle-show-password">
                    <input
                      type="checkbox"
                      id="changeShowPass"
                      onFocus={toggleFocused.bind(this, 'chk')}
                      onBlur={toggleFocused.bind(this, 'chk')}
                      onChange={toggleShowPass}
                    />
                    <label htmlFor="changeShowPass" className="check-label">
                      <div className={'check-mark' + (showPass ? ' check-mark-checked' : '')}>
                        <Check />
                      </div>
                    </label>
                    <label htmlFor="changeShowPass">{t('password-show')}</label>
                  </div>
                  <div className="forgot-password-link">
                    <Link to="/register">{t('register-link')}</Link> | <Link to="/forgotpass">{t('password-forgot')}</Link>
                  </div>
                </div>
                <input
                  name="submit"
                  type="submit"
                  value={t('confirm-button')}
                  className="airhack-btn airhack-btn-main margin-top login-button"
                />
                {error === 401 && (
                  <div className="field-error-message">
                    <Excl /> {t('wrong-cred')}
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      )}
    </I18n>
  );
};

export default LoginUI;
