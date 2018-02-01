// Import from packages
import React, { Fragment } from 'react';
import moment from 'moment';
import { I18n } from 'react-i18next';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import ArrowDown from 'react-icons/lib/fa/chevron-down';
import ArrowUp from 'react-icons/lib/fa/chevron-up';
import FaEdit from 'react-icons/lib/fa/edit';
import FaTrashO from 'react-icons/lib/fa/trash-o';
import FaPlusCircle from 'react-icons/lib/fa/plus-circle';


// Import from internal parts
import SubHeaderUI from 'components/Partials/SubHeader/ui';

// Import styles
import './style.scss';


/**
 * User interface for subheader component
 *
 * @param {Object} param - Object parameter
 * @param {Object[]} param.usersList - All displayed users
 * @param {Object} param.filter - Currently applied filters
 * @param {UpdateFormContainer#_toggleMobileOpen(index: int)} param.toggleMobileOpen - Method for toggling open element
 * @param {UpdateFormContainer#_renderArrow(event: Object)} param.renderArrow - Method for rendering arrow in react-select
 * @return The component HTML template
 */
const UsersUI = ({
  usersList,
  refresh,
  remove,
  update,
  add,
  toggleMobileOpen,
  renderArrow
}) => {
  return (
    <I18n ns={['account.users']}>
      {(t, { i18n }) => (
        <div className="activity-wrapper">
          <SubHeaderUI text={t('users-subtitle')} />

          <div className="filter-section provider buttons right">
                <button onClick={ add.bind(this) }>
                  <FaPlusCircle /> Add
                </button>
            </div>

          <div className="account-airhacks-desktop">
            <table>
              <thead>
                <tr>
                  <th>{t('users-last-name')}</th>
                  <th>{t('users-first-name')}</th>
                  <th>{t('users-email')}</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {usersList.map((user, i) => {
                  return (
                    <tr key={i}>
                      <td>{user.last_name}</td>
                      <td>{user.first_name}</td>
                      <td>{user.email}</td>
                      <td className="buttons">
                          <button className="right thrash" onClick={remove.bind(this, user.id)}><FaTrashO/> Delete</button>
                          <button className="right edit" onClick={update.bind(this, user)}><FaEdit/> Edit</button>
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
                  <th />
                  <th>{t('users-last-name')}</th>
                  <th>{t('users-first-name')}</th>
                </tr>
              </thead>
              <tbody>
                {usersList.map((user, i) => {
                  return (
                    <Fragment key={i}>
                      <tr
                        onClick={toggleMobileOpen.bind(this, i)}
                        className={user.mobile_open ? 'tr-mobile-open' : ''}>
                        <td className={'toggler' + (user.mobile_open ? ' open' : ' closed')}>
                          {user.mobile_open && <ArrowUp />}
                          {!user.mobile_open && <ArrowDown />}
                        </td>
                        <td>{user.last_name}</td>
                        <td>{user.first_name}</td>
                      </tr>
                      {user.mobile_open && (
                        <Fragment>
                          <tr className="tr-mobile-open">
                            <td />
                            <td colSpan="3">{user.first_name} {user.last_name}</td>
                          </tr>
                          <tr className="tr-mobile-open">
                            <td />
                            <td colSpan="3">{user.email}</td>
                          </tr>
                        </Fragment>
                      )}
                    </Fragment>
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

export default UsersUI;
