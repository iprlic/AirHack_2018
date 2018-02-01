// Import from packages
import React, { Fragment } from 'react';
import { I18n } from 'react-i18next';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import Form from 'react-validation/build/form';
import Input from 'react-validation/build/input';
import Button from 'react-validation/build/button';
import validator from 'validator'

// Import styles
import './style.scss';

const required = (value, props) => {
  if (!value || (props.isCheckable && !props.checked)) {
    return <span className="form-error is-visible">Required</span>;
  }
};

const email = (value) => {
  if (!validator.isEmail(value)) {
    return `${value} is not a valid email.`
  }
};

/**
 * User interface for subheader component
 *
 * @param {Object} param - Object parameter
 * @param {Object} param.account - Account for current user
 * @param {UpdateFormContainer#_handleChange(field: string, event: SyntheticEvent)} param.handleChange - Method for handling changes in each form field
 * @param {UpdateFormContainer#_patchProfile()} param.patchProfile - Method for actual profile update
 * @param {UpdateFormContainer#_clearChanges()} param.clearChanges - Method for clearing all form changes
 * @param {Boolean} param.hasChanges - If the form has any changes or not
 * @param {string} param.fields - Which fields that should be displayed in the form
 * @param {ProfileContainer#_changeMobileFieldSelected(field: string, fromFormSent: Boolean)} param.changeMobileFieldSelected - Method for going back and forth on mobile view
 * @param {Boolean} param.isMobile - If we have mobile view
 * @param {Object} param.fieldFocuses - Which react-select that should be focused
 * @param {UpdateFormContainer#_setFocus(field: string)} param.setFocus - Method for changing react-select focus
 * @param {UpdateFormContainer#_renderArrow(event: Object)} param.renderArrow - Method for rendering arrow in react-select
 * @param {Boolean} param.formSentOk - If the form was correctly sent
 * @param {UpdateFormContainer#_hideFormSent()} param.renderArrow - Method for rendering arrow in react-select
 * @return The component HTML template
 */
const UpdateFormUI = ({
  account,
  handleChange,
  patchProfile,
  clearChanges,
  hasChanges,
  fields,
  changeMobileFieldSelected,
  isMobile,
  fieldFocuses,
  setFocus,
  renderArrow,
  formSentOk,
  hideFormSent
}) => {
  return (
    <I18n ns={['account.profile']}>
      {(t, { i18n }) => (
        <div className="form-container">
          <Fragment>
            {formSentOk && (
              <div className="form-sent-ok">
                <div className="sent-header">
                  <div className="form-ok-image" />
                  <div className="form-sent-message">{t('form-sent-ok')}</div>
                </div>

                <div className="form-sent-button">
                  <button className="margin-top ok-button" onClick={hideFormSent}>
                    OK
                  </button>
                </div>
              </div>
            )}
            {!formSentOk && (
              <Fragment>
                <Form>
                  {(fields === 'all' || fields === 'first_name') && (
                    <div>
                      <label>{t('update-form_first-name')}:</label>
                      <br />
                      <Input
                        validations={[required]}
                        type="text"
                        value={account.first_name}
                        onChange={handleChange.bind(this, 'first_name')}
                      />
                    </div>
                  )}

                  {(fields === 'all' || fields === 'last_name') && (
                    <div>
                      <label>{t('update-form_last-name')}:</label>
                      <br />
                      <Input
                        validations={[required]}
                        type="text"
                        value={account.last_name}
                        onChange={handleChange.bind(this, 'last_name')}
                      />
                    </div>
                  )}

                  {(fields === 'all' || fields === 'email') && (
                    <div>
                      <label>{t('update-form_email')}:</label>
                      <br />
                      <Input
                        validations={[required,email]}
                        type="email"
                        value={account.email}
                        onChange={handleChange.bind(this, 'email')}
                      />
                    </div>
                  )}

                <div id="send-button-div">
                  <button
                    className="airhack-btn airhack-btn-grey profile-button left"
                    onClick={isMobile ? changeMobileFieldSelected.bind(this, 'all') : clearChanges}>
                    {t('update-form_cancel')}
                  </button>
                  <Button
                    className="airhack-btn airhack-btn-main profile-button right"
                    onClick={patchProfile}
                    disabled={!hasChanges}>
                    {t('update-form_submit')}
                  </Button>
                </div>
                </Form>
              </Fragment>
            )}
          </Fragment>
        </div>
      )}
    </I18n>
  );
};

export default UpdateFormUI;
