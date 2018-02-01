// Import from packages
import React, { Component } from 'react';

// Import from internal parts
import history from 'history.js';

// Import UI
import ProfileUI from './ui';

/**
 * Container component for profile
 *
 * @extends {Component}
 */
class ProfileContainer extends Component {
  /**
   * Initializes component object and sets initial component state.
   *
   * @override
   * @param {Object} props - Properties received from parent component
   * @param {Object} props.account - Currently logged in user's account
   */
  constructor(props) {
    super(props);
    this.state = {
      mobileFieldSelected: 'all'
    };
  }

  unlisten = history.listen((location, action) => {
    if (action === 'POP' && this.state.mobileFieldSelected !== 'all') {
      this.setState({ mobileFieldSelected: 'all' });
    }
  });

  /**
   * Faking browser history changes for mobile
   *
   * @param {string} field - User went to specific field or back to all fields
   * @param {Boolean} fromFormSent - If we changed wiew inside the form or not
   * @return {Object} - member data
   */
  _changeMobileFieldSelected = (field, fromFormSent) => {
    if (!fromFormSent) {
      if (field !== 'all') {
        history.push();
      } else {
        history.goBack();
      }
    }

    this.setState({ mobileFieldSelected: field });
  };

  /**
   * Render {@link ProfileUI} component
   */
  render() {
    const { account, update } = this.props;
    const { mobileFieldSelected } = this.state;

    return (
      <ProfileUI
        account={account}
        update={update}
        mobileFieldSelected={mobileFieldSelected}
        changeMobileFieldSelected={this._changeMobileFieldSelected}
      />
    );
  }
}

export default ProfileContainer;
