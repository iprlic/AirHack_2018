// Import from packages
import React, { Fragment } from 'react';
import moment from 'moment';
import { I18n } from 'react-i18next';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import ArrowDown from 'react-icons/lib/fa/chevron-down';
import ArrowUp from 'react-icons/lib/fa/chevron-up';
import FaFilter from 'react-icons/lib/fa/filter';
// Import from internal parts
import SubHeaderUI from 'components/Partials/SubHeader/ui';

// Import styles
import './style.scss';

const WeekleyReportUI = ({
  airhackList,
  toggleMobileOpen,
  renderArrow,
  userList,
  userChange,
  user_id,
  refresh,
  isAdmin
}) => {
  return (
    <I18n ns={['account.weekley_report']}>
      {(t, { i18n }) => (
        <div className="activity-wrapper">
          <SubHeaderUI text={t('weekley-subtitle')} />
          <div className="airhack-filter account-airhacks-desktop">
            <div className="filter-section left">
                {isAdmin && <Select
                  name="userSelect"
                  value={user_id}
                  onChange={userChange.bind(this)}
                  options={userList}
                  clearable={false}
                  className={'select-outer'}
                  optionClassName="select-inner"
                  arrowRenderer={renderArrow}
                  openOnFocus={true}
                />
                }
            </div>

            <div className="filter-section provider buttons left">
              {isAdmin && <button onClick={ refresh.bind(this) }>
                    <FaFilter /> Filter
                  </button>
              }
            </div>

          </div>
          <div className="account-airhacks-desktop">
            <table>
              <thead>
                <tr>
                  <th>{t('weekley-year')}</th>
                  <th>{t('weekley-week')}</th>
                  <th>{t('weekley-distance')}</th>
                  <th>{t('weekley-speed')}</th>
                </tr>
              </thead>
              <tbody>
                {airhackList.map((airhack, i) => {
                  return (
                    <tr key={i}>
                      <td>{airhack.year}</td>
                      <td>{airhack.week}</td>
                      <td>{airhack.distance} {t('weekley-km')}</td>
                      <td>{airhack.speed} {t('weekley-kmh')}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="account-airhacks-mobile">
            <table>
                <thead>
                  <tr>
                    <th>{t('weekley-year')}</th>
                    <th>{t('weekley-week')}</th>
                    <th>{t('weekley-distance')}</th>
                    <th>{t('weekley-speed')}</th>
                  </tr>
                </thead>
                <tbody>
                  {airhackList.map((airhack, i) => {
                    return (
                      <tr key={i}>
                        <td>{airhack.year}</td>
                        <td>{airhack.week}</td>
                        <td>{airhack.distance} {t('weekley-km')}</td>
                        <td>{airhack.speed} {t('weekley-kmh')}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
          </div>
        </div>
      )}
    </I18n>
  );
};

export default WeekleyReportUI;
