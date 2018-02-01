// Import from packages
import React, { Component } from 'react';

// Import from internal parts
import history from 'history.js';
import authService from 'services/Auth.js';

// Import UI
import OutsideNavigationUI from './ui';

/**
 * Container for navigation component
 *
 * Manages the top menu and logout functionality.
 *
 * @extends {Component}
 */
class OutsideNavigationContainer extends Component {
  /**
   * @override
   *
   * Sets initial component state.
   *
   * Note that data passed from parent may be empty at this moment, as it
   * is fetched asynchronously.
   *
   * @param {Object} props - properties received from parent component
   */
  constructor(props) {
    super(props);

    this.state = {
      languages: [{ key: 'en-US', name: 'English' }],
      pages: [
        { key: 'account-overview', url: '/', active: false },
        { key: 'my-profile', url: '/profile', active: false }
      ],
      showLngList: false,
      showMobileMenu: false
    };
  }

  /**
   * Find out which page that is active
   *
   * use window to get the current active path name to save for the active page
   * in the menu. The active page will then get the teal bottom border.
   */
  updatePageActive() {
    const pages = this.state.pages.map(page => {
      page.active = window.location.pathname === page.url;
      return page;
    });

    this.setState({ pages: pages });
  }

  /**
   * Hide mobile menu on window resize
   *
   * Hides dropdowns when they should not be displayed. This depends on the size
   * of the viewport. Mobile menu should be hidden when viewport is wider than
   * 1023 pixels.
   */
  hideMobileMenu() {
    if (window.innerWidth > 1023) {
      this.setState({ showMobileMenu: false });
    }
  }

  /**
   * React hook which gets executed after component mounts.
   *
   * Has access to state, and therefore does not receive parameters.
   *
   * Note that on first render the state may not yet have the account data, as
   * it is fetched asynchronously from the parent. If that is the case, once
   * account data was fetched, it will be passed to {@link componentWillReceiveProps}.
   */
  componentDidMount() {
    this.updatePageActive();
    window.addEventListener('resize', this.hideMobileMenu.bind(this));
  }

  /**
   * React hook which gets executed before component unmounts.
   *
   * Has access to state, and therefore does not receive parameters.
   */
  componentWillUnmount() {
    window.removeEventListener('resize', this.hideMobileMenu.bind(this));
  }

  /**
   * React hook which gets executed when component will receive new parameters.
   *
   * Note that this method will only get executed if account data (fetched
   * asynchronously) was not available at the moment {@link componentDidMount}
   * was executed.
   *
   * @param {object} nextProps - properties received from parent component
   */
  componentWillReceiveProps(nextProps) {
    this.updatePageActive();
  }

  /**
   * Toggles display of language list.
   *
   * Method for toggling the display of the language list.
   */
  toggleLngList = () => {
    this.setState({ showLngList: !this.state.showLngList });
  };

  /**
   * Toggles display of mobile menu.
   *
   * Method for toggling the display of the language list.
   */
  toggleMobileMenu = () => {
    this.setState({ showMobileMenu: !this.state.showMobileMenu });
  };

  /**
   * Handle logout of user.
   *
   * Uses {@link AuthService#logout} to make the actual logout.
   *
   * @param {SytheticEvent} event - A React synthetic event {@see https://reactjs.org/docs/events.html}
   */
  handleLogout = event => {
    event.preventDefault();

    this.setState({ showLngList: false, showMobileMenu: false });

    authService.logout();

    history.push('/login');
  };

  /**
   * Renders the {@link NavigationUI} component
   */
  render() {
    return (
      <OutsideNavigationUI
        logout={this.handleLogout}
        languages={this.state.languages}
        pages={this.state.pages}
        showLngList={this.state.showLngList}
        toggleLngList={this.toggleLngList}
        showMobileMenu={this.state.showMobileMenu}
        toggleMobileMenu={this.toggleMobileMenu}
      />
    );
  }
}

export default OutsideNavigationContainer;
