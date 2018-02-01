// Import from packages
import React, { Fragment } from 'react';
import moment from 'moment';
import { I18n } from 'react-i18next';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import FaEdit from 'react-icons/lib/fa/edit';
import FaTrashO from 'react-icons/lib/fa/trash-o';
import FaFilter from 'react-icons/lib/fa/filter';
import FaPlusCircle from 'react-icons/lib/fa/plus-circle';
import DateRangePickerWrapper from '../../../Helpers/Dates/DateRangePickerWrapper';

// Import from internal parts
import SubHeaderUI from 'components/Partials/SubHeader/ui';

// Import styles
import './style.scss';

/**
 * User interface for airhack activity
 * @param  {[type]} options.airhackList      [description]
 * @param  {[type]} options.filter           [description]
 * @param  {[type]} options.focusChange      [description]
 * @param  {[type]} options.datesChange      [description]
 * @param  {[type]} options.remove           [description]
 * @param  {[type]} options.update           [description]
 * @param  {[type]} options.add           [description]
 * @param  {[type]} options.refresh          [description]
 * @param  {[type]} options.toggleMobileOpen [description]
 * @param  {[type]} options.renderArrow      [description]
 * @return {[type]}                          [description]
 */
const AccountActivityUI = ({
  airhackList,
  userList,
  filter,
  datesChange,
  userChange,
  user_id,
  refresh,
  remove,
  update,
  add,
  toggleMobileOpen,
  renderArrow,
  isAdmin
}) => {
  return (
    <I18n ns={['account.dashboard']}>
      {(t, { i18n }) => (
        <div className="activity-wrapper">
          <SubHeaderUI text={t('activity_sub-title')} />
          <div className="airhack-filter account-airhacks-desktop">
            <div className="filter-section month left">
                <DateRangePickerWrapper
                  startDateId='start-date'
                  endDateId='end-date'
                  onDatesChange={ datesChange.bind(this) }
                />
            </div>
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
                <button onClick={ refresh.bind(this) }>
                  <FaFilter /> Filter
                </button>
            </div>
            <div className="filter-section provider buttons right">
                <button onClick={ add.bind(this, user_id) }>
                  <FaPlusCircle /> Add
                </button>
            </div>
          </div>

          <div className="account-airhacks-desktop">
            <table>
              <thead>
                <tr>
                  <th>{t('airhack-date')}</th>
                  <th>{t('airhack-distance')}</th>
                  <th>{t('airhack-time')}</th>
                  <th>{t('airhack-averge-speed')}</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {airhackList.map((airhack, i) => {
                  return (
                    <tr key={i}>
                      <td>{moment(airhack.date).format(t('date-format'))}</td>
                      <td>{airhack.distance} {t('airhack-km')}</td>
                      <td>{moment(airhack.date + ' ' + airhack.time).format(t('time-format'))}</td>
                      <td>{airhack.average_speed} {t('airhack-kmh')}</td>
                      <td className="buttons">
                          <button className="right thrash" onClick={remove.bind(this, airhack.id)}><FaTrashO/> Delete</button>
                          <button className="right edit" onClick={update.bind(this, airhack)}><FaEdit/> Edit</button>
                      </td>
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
                <th>{t('airhack-date')}</th>
                <th>{t('airhack-distance')}</th>
                <th>{t('airhack-time')}</th>
                </tr>
              </thead>
              <tbody>
              {airhackList.map((airhack, i) => {
                  return (
                    <tr key={i}>
                      <td>{moment(airhack.date).format(t('date-format'))}</td>
                      <td>{airhack.distance} {t('airhack-km')}</td>
                      <td>{moment(airhack.date + ' ' + airhack.time).format(t('time-format'))}</td>
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

export default AccountActivityUI;
