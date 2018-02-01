// Import from packages
import React, { Fragment } from 'react';
import { I18n } from 'react-i18next';
import ArrowRight from 'react-icons/lib/fa/chevron-right';

// Import from internal parts
import PageHeaderUI from '../../Partials/PageHeader/ui';
import UpdateFormContainer from './UpdateForm/container';

// Import styles
import './style.scss';

/**
 * User interface for Account component
 *
 * Passes {@link AccountContainer#updateAccountData} for updating user and
 * member data.
 *
 * @param {Object} param - Object parameter
 * @param {Object} param.account - Account for current user
 * @param {AccountContainer#updateAccountData(accountData: Object)} param.update - Method for updating account data
 * @param {Object} param.mobileFieldSelected - Which field is shown on mobile
 * @param {ProfileContainer#_changeMobileFieldSelected(field: string, fromFormSent: Boolean)} param.changeMobileFieldSelected - Method for going back and forth on mobile view
 * @return The component HTML template
 */
const ProfileUI = ({ account, update, mobileFieldSelected, changeMobileFieldSelected }) => {
  return (
    <I18n ns={['account.profile']}>
      {(t, { i18n }) => (
        <div className="account-profile">
          <div className="display-tablet-desktop">
            <PageHeaderUI text={t('page-title')} />

            <UpdateFormContainer
              account={account}
              update={update}
              fields="all"
              changeMobileFieldSelected={changeMobileFieldSelected}
            />
          </div>

          <div className="display-mobile">
            {mobileFieldSelected === 'all' && (
              <Fragment>
                <PageHeaderUI text={t('page-title')} />
                <div className="mobile-profile-list">
                  <div
                    className="mobile-profile-list-item"
                    onClick={changeMobileFieldSelected.bind(this, 'first_name')}>
                    <div className="title-value">
                      <div className="title">{t('update-form_first-name')}</div>
                      <div className="value">{account.first_name}</div>
                    </div>
                    <div className="edit">
                      {t('update-form_edit')} <ArrowRight />
                    </div>
                  </div>
                  <div
                    className="mobile-profile-list-item"
                    onClick={changeMobileFieldSelected.bind(this, 'last_name')}>
                    <div className="title-value">
                      <div className="title">{t('update-form_last-name')}</div>
                      <div className="value">{account.last_name}</div>
                    </div>
                    <div className="edit">
                      {t('update-form_edit')} <ArrowRight />
                    </div>
                  </div>
                  <div
                    className="mobile-profile-list-item"
                    onClick={changeMobileFieldSelected.bind(this, 'email')}>
                    <div className="title-value">
                      <div className="title">{t('update-form_email')}</div>
                      <div className="value">{account.email}</div>
                    </div>
                    <div className="edit">
                      {t('update-form_edit')} <ArrowRight />
                    </div>
                  </div>
                </div>
              </Fragment>
            )}
            {mobileFieldSelected !== 'all' && (
              <Fragment>
                <div onClick={changeMobileFieldSelected.bind(this, 'all')}>
                  <PageHeaderUI text={t('page-edit')} isSub={true} />
                </div>
                <UpdateFormContainer
                  account={account}
                  update={update}
                  fields={mobileFieldSelected}
                  changeMobileFieldSelected={changeMobileFieldSelected}
                />
              </Fragment>
            )}
          </div>
        </div>
      )}
    </I18n>
  );
};

export default ProfileUI;
