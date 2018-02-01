// Import from packages
import React, { Component } from 'react';

// Import from internal parts
import history from 'history.js';

// Import UI
import DashboardUI from './ui';

/**
 * Container for dashboard component
 *
 * @extends {Component}
 */
class DashboardContainer extends Component {
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

    this.state = { mobilePage: 'all' };
  }

  unlisten = history.listen((location, action) => {
    if (action === 'POP' && this.state.mobilePage !== 'all') {
      this.setState({ mobilePage: 'all' });
    }
  });

  /**
   * Changes page on mobile view.
   *
   * Displays a certain page depending on input (all displays list of subpages)
   *
   * @param {string} page - The page to go to
   * @param {SyntheticEvent} event - A React synthetic event {@see https://reactjs.org/docs/events.html}
   * @param {string} event.target.value - The new value of the field
   */
  _changePage = (page, event) => {
    if (page !== 'all') {
      history.push();
    } else {
      history.goBack();
    }

    this.setState({ mobilePage: page });
  };

  /**
   * Renders the {@link DashboardUI} component
   */
  render() {
    const account = this.props.account || {};

    return (
      <DashboardUI
        account={account}
        mobilePage={this.state.mobilePage}
        changePage={this._changePage}
      />
    );
  }
}

export default DashboardContainer;
