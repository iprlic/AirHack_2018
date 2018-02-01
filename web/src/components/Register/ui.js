// Import from packages
import React from 'react';
import { I18n } from 'react-i18next';
import Mail from 'react-icons/lib/fa/envelope';
import Excl from 'react-icons/lib/fa/exclamation-circle';
import Lock from 'react-icons/lib/fa/lock';
import Check from 'react-icons/lib/fa/check';
import FaUser from 'react-icons/lib/fa/user';
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
 * @param {LoginContainer#register(event: SytheticEvent)} param.register - Method for sending reset link
 * @param {Object} param.focused - Contains focused status for all form fields
 * @param {Object} param.error - Contains error status for all form fields
 * @param {LoginContainer#toggleFocused(field: string, event: SytheticEvent)} param.toggleFocused - Method for setting focus to clicked element
 * @param {LoginContainer#unsetError(field: string, event: SytheticEvent)} param.unsetError - Method for removing error from changed element
 * @param {Boolean} param.mailSent - If the mail has been sent or not
 * @param {boolean} param.showPass - Determines if password should be displkayed in the field or not
 * @param {RegisterContainer#toggleShowPass()} param.toggleShowPass - Method for toggling if password should be displayed
 * @return The component HTML template
 */
const RegisterUI = ({ register, focused, error, toggleFocused, unsetError, mailSent, showPass, toggleShowPass }) => {
  return (
    <I18n ns={['login']}>
      {(t, { i18n }) => (
        <div className="login-container">
          <OutsideNavigationContainer />
          {!mailSent && (
            <div className="login-form-container">
              <div className="login-header">
                <div className="login-brand-logo" />
                <div className="login-welcome">{t('register-page-title')}</div>
                <div className="login-message">{t('register-page-desc')}</div>
              </div>

              <div className="login-form">
                <form onSubmit={register}>
                  <div
                    className={
                      'field-container' +
                      (focused.first_name ? ' field-focused' : '') +
                      (error.first_name ? ' field-error' : '')
                    }>
                    <div
                      className={
                        'field-left-icon' +
                        (focused.first_name ? ' icon-focused' : '') +
                        (error.first_name ? ' icon-error' : '')
                      }>
                      <FaUser />
                    </div>
                    <div className="field-input">
                      <input
                        name="first_name"
                        placeholder={t('placehold-first-name')}
                        type="text"
                        onFocus={toggleFocused.bind(this, 'first_name')}
                        onBlur={toggleFocused.bind(this, 'first_name')}
                        onChange={unsetError.bind(this, 'first_name')}
                      />
                    </div>
                  </div>
                  <div
                    className={
                      'field-container' +
                      (focused.last_name ? ' field-focused' : '') +
                      (error.last_name ? ' field-error' : '')
                    }>
                    <div
                      className={
                        'field-left-icon' +
                        (focused.last_name ? ' icon-focused' : '') +
                        (error.last_name ? ' icon-error' : '')
                      }>
                      <FaUser />
                    </div>
                    <div className="field-input">
                      <input
                        name="last_name"
                        placeholder={t('placehold-last-name')}
                        type="text"
                        onFocus={toggleFocused.bind(this, 'last_name')}
                        onBlur={toggleFocused.bind(this, 'last_name')}
                        onChange={unsetError.bind(this, 'last_name')}
                      />
                    </div>
                  </div>
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
                        name="email"
                        placeholder={t('placehold-mail')}
                        type="text"
                        onFocus={toggleFocused.bind(this, 'mail')}
                        onBlur={toggleFocused.bind(this, 'mail')}
                        onChange={unsetError.bind(this, 'mail')}
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

                </div>

                  {error.mail && (
                    <div className="field-error-message">
                      <Excl /> {t('wrong-mail')}
                    </div>
                  )}
                  <input
                    name="submit"
                    type="submit"
                    value={t('register-page-button')}
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
                <div className="login-welcome">{t('register-page-sent-title')}</div>
                <div className="login-message">{t('register-page-sent-desc')}</div>
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

export default RegisterUI;
