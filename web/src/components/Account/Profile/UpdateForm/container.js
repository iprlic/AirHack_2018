// Import from packages
import React, { Component } from 'react';
import { translate } from 'react-i18next';
import ArrowDown from 'react-icons/lib/fa/chevron-down';
import ArrowUp from 'react-icons/lib/fa/chevron-up';

// Import from internal parts
import dataService from 'services/Data';
import { sortByObjectKey } from 'helpers/Array';

// Import UI
import UpdateFormUI from './ui';

/**
 * Container for update form component
 *
 * Manages updating of user and membership data.
 *
 * @extends {Component}
 */
class UpdateFormContainer extends Component {
  /**
   * Initializes component object and sets initial component state.
   *
   * @override
   * @param {Object} props - Properties received from parent component
   * @param {Object} props.account - Currently logged in user's account
   */
  constructor(props) {
    super(props);

    // Needs to set account into state as account info may get changed by the
    // user, but we still need to compare current state to what was originally
    // passed in to be able to enable/disable control buttons.

    // In order to avoid problems with form text inputs changing from
    // uncontrolled to controlled, the values passed to them must be empty
    // strings rather than null/undefined

    const account =
      Object.keys(props.account).length > 0 ? { ...props.account } : this._generateEmptyAccount();
    this.state = {
      account: account,
      hasChanges: false,
      isMobile: false,
      fieldFocuses: {

      },
      formSentOk: false
    };
  }

  /**
   * Generates empty account
   *
   * Generate an empty account with first name, last name and email.
   *
   * @return {Object} The empty account
   */
  _generateEmptyAccount() {
    return {
      first_name: '',
      last_name: '',
      email: ''
    };
  }

  /**
   * Toggles window type.
   *
   * Switches window type between mobile and not mobile. Mobile window has a
   * width of less than 768 pixels.
   */
  toggleWindowType() {
    if (window.innerWidth < 768) {
      this.setState({ isMobile: true });
    } else {
      this.setState({ isMobile: false });
    }
  }

  /**
   * React hook which gets executed after component mounts.
   *
   */
  async componentDidMount() {
    window.addEventListener('resize', this.toggleWindowType.bind(this));

    if (window.innerWidth < 768) {
      this.setState({ isMobile: true });
    }
  }

  /**
   * React hook which gets executed if the component props are updated by parent.
   *
   * @param {Object} nextProps - The props that will be recieved from the parent
   * @param {Object} nextProps.account - Currently logged in user's account
   */
  componentWillReceiveProps(nextProps) {
    // When we get the new account data, we're certain it does not have changes
    this.setState({ account: { ...nextProps.account }, hasChanges: false });
  }

  /**
   * Updates component state when a field value is changed.
   *
   * This takes the field name and event to update the whole state using the
   * new value in the field. This function is called by the UI on every change
   * which means that in input fields (except cancel and submit), every change
   * in that field triggers this function.
   *
   * @param {string} field - The field being updated
   * @param {SyntheticEvent} event - A React synthetic event {@see https://reactjs.org/docs/events.html}
   * @param {string} event.target.value - The new value of the field
   */
  _handleChange = (field, event) => {
    const newAccount = { ...this.state.account };
    const oldAccount = { ...this.props.account };

    if (event.target && event.target.value) {
      newAccount[field] = event.target.value;
    }

    if (event.value) {
      newAccount[field] = event.value;
    }

    const hasChanges = JSON.stringify(newAccount) !== JSON.stringify(oldAccount);

    this.setState({ account: newAccount, hasChanges: hasChanges });
  };

  /**
   * Calls the update method passed from parent and gives it the new acccount
   * data. Does not handle API calls itself, as parent container is concerned
   * with getting/updating account data.
   */
  _patchProfile = async (event) => {
    event.preventDefault();
    const newAccount = { ...this.state.account };

    // Update current account data
    try {
      await this.props.update(newAccount);
      this.setState({ formSentOk: true });
    } catch (e) {
      console.debug('Error updating account', e);
    }
  };

  /**
   * Clears any changes made to the form.
   *
   * Basically a reset form function.
   */
  _clearChanges = async () => {
    this.setState({ account: { ...this.props.account }, hasChanges: false });
  };

  /**
   * Updates focus on a field when focused or blurred.
   *
   * @param {string} field - The field being focused or unfocused
   */
  _setFocus = field => {
    const fieldFocuses = this.state.fieldFocuses;

    fieldFocuses[field] = !fieldFocuses[field];

    this.setState({ fieldFocuses: fieldFocuses });
  };

  /**
   * Arrow render function for react-select fields.
   *
   * Checks if the field dropdown is open or closed and returns the correct
   * arrow depending on open-state.
   *
   * @param {string} field - The field being updated
   * @param {Object} event - Contause isOpen that determines if the select is open or not
   * @Return {ArrowUp|ArrowDown} ArrowUp if the field is open, otherwise ArrowDown
   */
  _renderArrow = event => {
    if (event.isOpen) {
      return <ArrowUp />;
    } else {
      return <ArrowDown />;
    }
  };

  /**
   * Hide sent page.
   *
   * Hides the page telling user that form was sent.
   */
  _hideFormSent = () => {
    this.setState({ formSentOk: false });
    this.props.changeMobileFieldSelected('all', true);
  };

  /**
   * Renders the {@link UpdateFormUI} component
   */
  render() {
    const {
      account,
      hasChanges,
      isMobile,
      fieldFocuses,
      formSentOk
    } = this.state;
    const { fields, changeMobileFieldSelected } = this.props;

    return (
      <UpdateFormUI
        account={account}
        handleChange={this._handleChange}
        patchProfile={this._patchProfile}
        clearChanges={this._clearChanges}
        hasChanges={hasChanges}
        fields={fields}
        changeMobileFieldSelected={changeMobileFieldSelected}
        isMobile={isMobile}
        fieldFocuses={fieldFocuses}
        setFocus={this._setFocus}
        renderArrow={this._renderArrow}
        formSentOk={formSentOk}
        hideFormSent={this._hideFormSent}
      />
    );
  }
}

export default UpdateFormContainer;
