// Import from packages
import React from 'react';
import { I18n } from 'react-i18next';

// Import from internal parts
import PageHeaderUI from '../../Partials/PageHeader/ui';
import ActivityContainer from './Activity/container';
import SubHeaderMobileUI from '../../Partials/SubHeaderMobile/ui';

// Import styles
import './style.scss';

/**
 * User interface for Dashboard component
 *
 * @param {Object} param - Object parameter
 * @param {Object} param.account - Account for current user
 * @param {string} param.mobilePage - If all or a certain pages should be shown on mobile view
 * @param {DashboardContainer#_changePage(page: string, event: SyntheticEvent)} param.changePage - Method for changing page in mobile view
 * @return The component HTML template
 */
const DashboardUI = ({ account, mobilePage, changePage }) => {

  return (
    <I18n ns={['account.dashboard']}>
      {(t, { i18n }) => (
        <div className="account-dashboard">
          {/* DESKTOP AND TABLET START */}
          <div className="display-tablet-desktop">
            <PageHeaderUI text={t('page-title')} />
            <ActivityContainer account={account} />
          </div>
          {/* DESKTOP AND TABLET END */}

          {/* MOBILE START */}
          <div className="display-mobile">
            {mobilePage === 'all' && (
              <div>
                <PageHeaderUI text={t('page-title')} />

                <div onClick={changePage.bind(this, 'activity')}>
                  <SubHeaderMobileUI text={t('activity_sub-title')} />
                </div>
              </div>
            )}

            {mobilePage === 'activity' && (
              <div>
                <div onClick={changePage.bind(this, 'all')}>
                  <PageHeaderUI text={t('activity_sub-title')} isSub={true} />
                </div>
                <ActivityContainer account={account} />
              </div>
            )}
          </div>
          {/* MOBILE END */}
        </div>
      )}
    </I18n>
  );
};

export default DashboardUI;
