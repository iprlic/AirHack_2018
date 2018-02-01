// Import from packages
import React from 'react';
import { I18n } from 'react-i18next';
import { Link } from 'react-router-dom';
import IconDown from 'react-icons/lib/fa/angle-down';
import IconUp from 'react-icons/lib/fa/angle-up';
import IconBars from 'react-icons/lib/fa/bars';

// Import styles
import './style.scss';

/**
 * Actual template
 */
/**
 * User interface for Navigation component
 *
 * Uses {@link NavigationContainer#handleLogout} for logging out
 *
 * @param {Object} param - Object parameter
 * @param {NavigationContainer#logout()} param.logout - Method for logging out
 * @param {Object[]} param.languages - Possible languages
 * @param {Object[]} param.pages - Pages that should be shown in the menu
 * @param {Boolean} param.showLngList - If the language list should be displayed or not
 * @param {NavigationContainer#toggleLngList()} param.toggleLngList - Method for toggling display of manguage list
 * @param {Boolean} param.showMobileMenu - If the mobile menu should be open or not
 * @param {NavigationContainer#toggleMobileMenu()} param.toggleMobileMenu - Method for toggle opening of mobile menu
 * @return The component HTML template
 */
const NavigationUI = ({
  logout,
  languages,
  pages,
  showLngList,
  toggleLngList,
  showMobileMenu,
  toggleMobileMenu
}) => {
  return (
    <I18n ns={['navigation']}>
      {(t, { i18n }) => (
        <div className="nav-wrapper">
          <div className="brand-logo"> </div>
          <div className="brand-text">{t('brand-text')}</div>

          {pages.map((page, i) => (
              <Link
                to={page.url}
                className={'link-container' + (page.active ? ' active' : '') + (page.visible ? '' : ' hide')}
                key={i}>
                {t(page.key)}
              </Link>
          ))}

          <div className="link-container right" onClick={logout}>
            {t('logout')}
          </div>

          <div className="link-container right lngMenu" onClick={toggleLngList}>
            <div className="desktop-lng-name">{t('current-lng')}</div>
            {!showLngList && (
              <div className="desktop-lng-caret">
                <IconDown />
              </div>
            )}
            {showLngList && (
              <div className="desktop-lng-caret open">
                <IconUp />
              </div>
            )}
          </div>

          {showLngList && (
            <div className="lng-list-dropdown-wrapper">
              {languages.map(
                (language, i) =>
                  t('current-lng-key') !== language.key && (
                    <div
                      className={'lng-list-dropdown-item'}
                      key={i}
                      onClick={() => {
                        i18n.changeLanguage(language.key);
                        toggleLngList();
                      }}>
                      {language.name}
                      <img
                        src={require(`../../../images/flags/${language.key}.png`)}
                        alt=""
                        height="16px"
                        className="flag-image"
                      />
                    </div>
                  )
              )}
            </div>
          )}

          <div
            className={'hamburger-button' + (showMobileMenu ? ' open' : '')}
            onClick={toggleMobileMenu}>
            <IconBars />
          </div>

          {showMobileMenu && (
            <div className="mobile-menu-dropdown-wrapper">
              <div className="mobile-menu-dropdown-item" onClick={toggleLngList}>
                <div className="mobile-lng-name">
                  {t('current-lng')}
                  <img
                    src={require(`../../../images/flags/${t('current-lng-key')}.png`)}
                    alt=""
                    height="16px"
                    className="flag-image"
                  />
                </div>
                {!showLngList && (
                  <div className="mobile-lng-caret">
                    <IconDown />
                  </div>
                )}
                {showLngList && (
                  <div className="mobile-lng-caret open">
                    <IconUp />
                  </div>
                )}
              </div>

              {showLngList &&
                languages.map(
                  (language, i) =>
                    t('current-lng-key') !== language.key && (
                      <div
                        className="mobile-menu-dropdown-item language"
                        key={i}
                        onClick={() => {
                          i18n.changeLanguage(language.key);
                          toggleLngList();
                          toggleMobileMenu();
                        }}>
                        {language.name}
                        <img
                          src={require(`../../../images/flags/${language.key}.png`)}
                          alt=""
                          height="16px"
                          className="flag-image"
                        />
                      </div>
                    )
                )}

              {pages.map((page, i) => (
                <Link
                  to={page.url}
                  className={'mobile-menu-dropdown-item' + (page.visible ? '' : ' hide')}
                  key={i}
                  onClick={toggleMobileMenu}>
                  {t(page.key)}
                </Link>
              ))}

              <div className="mobile-menu-dropdown-item" onClick={logout}>
                {t('logout')}
              </div>
            </div>
          )}
        </div>
      )}
    </I18n>
  );
};

export default NavigationUI;
