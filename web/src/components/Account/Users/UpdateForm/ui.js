import React from 'react';
import { Modal } from 'react-bootstrap'
import { confirmable } from 'react-confirm';
import dataService from 'services/Data';
import Select from 'react-select';
import ArrowUp from 'react-icons/lib/fa/chevron-up';
import ArrowDown from 'react-icons/lib/fa/chevron-down';
import Excl from 'react-icons/lib/fa/exclamation-circle';
import validator from 'validator'
import Form from 'react-validation/build/form';
import Input from 'react-validation/build/input';
import Button from 'react-validation/build/button';


const required = (value, props) => {
  if (!value || (props.isCheckable && !props.checked)) {
    return <span className="form-error is-visible">Required</span>;
  }
};

const email = (value) => {
  if (!validator.isEmail(value)) {
    return `${value} is not a valid email.`
  }
};

class UpdateForm extends React.Component {

  constructor(props) {
    super(props);

    // Needs to set account into state as account info may get changed by the
    // user, but we still need to compare current state to what was originally
    // passed in to be able to enable/disable control buttons.

    // In order to avoid problems with form text inputs changing from
    // uncontrolled to controlled, the values passed to them must be empty
    // strings rather than null/undefined

    const user =Object.keys(props.user).length > 0 ? { ...props.user } : {};
    this.state = {
        showPass: false,
        user: user,
        err: null,
        userRolesList: [
          { value: 1, label: "Regular user" },
          { value: 3, label: "User Manager" },
          { value: 7, label: "Admin" }
        ],
        hasChanges: false
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ user: { ...nextProps.user }, hasChanges: false });
  }

  /**
   * Prepares the user data for patching.
   *
   * Takes old accaount data and compares it with new user data. Removes all
   * not updated fields.
   *
   * @param {Object} old - Old joggging data
   * @param {Object} new - New user data for update
   * @param {string[]} defaultKeys - All keys possible for patching
   * @param {Object} pathTransformations - Any keys not same in GET and PATCH
   */
  _preparePatchObj(oldData, newData, defaultKeys, pathTransformations) {
    // All keys in the updated object
    const keys = Object.keys(newData);
    //Remove keys that are not updated
    const filteredKeys = keys.filter(function(key) {
      return (
        (oldData[key] === undefined || oldData[key] !== newData[key]) &&
        defaultKeys.indexOf(key) !== -1
      );
    });

    const returnData = filteredKeys.reduce((acc, key) => {
      if (newData[key] === undefined) {
        return acc;
      }

      return { ...acc, [key]: newData[key] };
    }, {});
    // for this object
    const returnDataTransformed = Object.keys(returnData).reduce((acc, key) => {
      if (pathTransformations[key] !== undefined) {
        return { ...acc, [pathTransformations[key]]: returnData[key] };
      }

      return { ...acc, [key]: returnData[key] };
    }, {});

    // When dirty fix above is removed, change this to "returnData"
    return returnDataTransformed;
  }


  _handleSave = async (event) => {
    event.preventDefault();
    this.form.validateAll();

    if(this.button.hasErrors){
      return;
    }

    const { proceed } = { ...this.props };

    const oldData = { ...this.props.user };
    const newData = { ...this.state.user };

    const defaultUserKeys = ['first_name', 'last_name', 'email', 'active', 'roles'];
    if(!newData.id){
      defaultUserKeys.push('password');
    }

    // Get objects
    const data = this._preparePatchObj(
      oldData,
      newData,
      defaultUserKeys,
      {}
    );

    try {

      if(newData.id){
        await dataService.patch('accounts/users/details/' + newData.id, data);
      }else{
        await dataService.post('accounts/users/details', data);
      }
      proceed({
          user: newData,
      });
    } catch (err) {
      this.setState({error: 'Error occured, unable to save the entity!'});
    }


  }

  _handleChange = (field, event) => {

    const newUser = { ...this.state.user };
    const oldUser = { ...this.props.user };

    if (event.target) {
      if(event.target.value==='checkbox'){
        newUser[field] = event.target.checked;
      }else{
        if(!event.target.value) event.target.value = null;
        newUser[field] = event.target.value;
      }
    }else{
      newUser[field] = event.value;
    }

    const hasChanges = JSON.stringify(newUser) !== JSON.stringify(oldUser);

    this.setState({ user: newUser, hasChanges: hasChanges });
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

  toggleShowPass = () => {
    this.setState({ showPass: !this.state.showPass });
  };

  render() {
    const {
      show,
      dismiss,
      cancel,
      message
    } = this.props;

    return (
      <div className="static-modal">
        <Modal show={show} onHide={dismiss} >
          <Modal.Header>
            <Modal.Title></Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {message}
          </Modal.Body>
          <Modal.Footer>
            <div className="form-container">
            <Form ref={c => { this.form = c }}>
              <div>
                <label>First name:</label>
                <br />
                <Input
                  type="text"
                  validations={[required]}
                  value={this.state.user.first_name}
                  onChange={this._handleChange.bind(this, 'first_name')}
                />
              </div>
               <div>
                <label>Last name:</label>
                <br />
                <Input
                  type="text"
                  validations={[required]}
                  value={this.state.user.last_name}
                  onChange={this._handleChange.bind(this, 'last_name')}
                />
              </div>
               <div>
                <label>Email:</label>
                <br />
                <Input
                  type="email"
                  validations={[required, email]}
                  value={this.state.user.email}
                  onChange={this._handleChange.bind(this, 'email')}
                />
              </div>
              <div>
                <label>Active:</label>
                <br />
                <input
                  type="checkbox"
                  value="checkbox"
                  defaultChecked={this.state.user.active}
                  onChange={this._handleChange.bind(this, 'active')}
                />
              </div>
              <div>
                <label>Roles:</label>
                <br />
                <Select
                    name="roles"
                    value={this.state.user.roles}
                    onChange={this._handleChange.bind(this, 'roles')}
                    options={this.state.userRolesList}
                    clearable={false}
                    className={'select-outer'}
                    optionClassName="select-inner"
                    arrowRenderer={this._renderArrow}
                    openOnFocus={true}
                  />
              </div>
              { !this.state.user.id && <div>
                    <label>Password:</label>
                    <br/>
                      <Input
                        validations={[required]}
                        name="password"
                        type={this.state.showPass ? 'text' : 'password'}
                        onChange={this._handleChange.bind(this, 'password')}
                      />
                </div>
              }
             { !this.state.user.id &&  <div>
                  <label>Show password:</label>
                    <br/>
                  <input
                        type="checkbox"
                        id="changeShowPass"
                        onChange={this.toggleShowPass}
                      />
                </div>
            }

              { this.state.error && <div className="field-error-message">
                    <Excl /> {this.state.error}
                  </div>
              }
              <div id="send-button-div">
                  <button
                    className="airhack-btn airhack-btn-grey profile-button left"
                    onClick={cancel}>
                    Cancel
                  </button>
                  <Button
                    ref={c => { this.button = c }}
                    className="airhack-btn airhack-btn-main profile-button right"
                    onClick={this._handleSave.bind(this)}
                    disabled={!this.state.hasChanges}>
                    Save
                  </Button>
                </div>
                </Form>
            </div>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }
}


export default confirmable(UpdateForm);
