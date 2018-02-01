import React from 'react';
import { Modal } from 'react-bootstrap'
import { confirmable } from 'react-confirm';
import dataService from 'services/Data';
import Excl from 'react-icons/lib/fa/exclamation-circle';
import Form from 'react-validation/build/form';
import Input from 'react-validation/build/input';
import Button from 'react-validation/build/button';


const required = (value, props) => {
  if (!value || (props.isCheckable && !props.checked)) {
    return <span className="form-error is-visible">Required</span>;
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

    const airhack =Object.keys(props.airhack).length > 0 ? { ...props.airhack } : {};
    this.state = {
        err: null,
        airhack: airhack,
        hasChanges: false
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ airhack: { ...nextProps.airhack }, hasChanges: false });
  }

  /**
   * Prepares the airhack data for patching.
   *
   * Takes old accaount data and compares it with new airhack data. Removes all
   * not updated fields.
   *
   * @param {Object} old - Old joggging data
   * @param {Object} new - New airhack data for update
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

    const oldData = { ...this.props.airhack };
    const newData = { ...this.state.airhack };

    const defaultUserKeys = ['date', 'distance', 'time'];

    // Get objects
    const data = this._preparePatchObj(
      oldData,
      newData,
      defaultUserKeys,
      {}
    );

    try {

      if(newData.id){
        await dataService.patch('airhack/' + newData.user_id + '/' + newData.id, data);
      }else{
        await dataService.post('airhack/' + newData.user_id, data);
      }
      proceed({
          airhack: newData,
      });
    } catch (e) {
      this.setState({error: 'Error occured, unable to save the entity!'});
    }


  }

  _handleChange = (field, event) => {

    const newAirhack = { ...this.state.airhack };
    const oldAirhack = { ...this.props.airhack };

    if (event.target) {
      if(!event.target.value) event.target.value = null;
      newAirhack[field] = event.target.value;
    }

    const hasChanges = JSON.stringify(newAirhack) !== JSON.stringify(oldAirhack);


    this.setState({ airhack: newAirhack, hasChanges: hasChanges });
  };

  render() {
    const {
      show,
      proceed,
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
                <label>Date:</label>
                <br />
                <Input
                  validations={[required]}
                  type="date"
                  value={this.state.airhack.date}
                  onChange={this._handleChange.bind(this, 'date')}
                />
              </div>
             <div>
                <label>Distance:</label>
                <br />
                <Input
                  type="number"
                  value={this.state.airhack.distance}
                  onChange={this._handleChange.bind(this, 'distance')}
                />
              </div>
              <div>
                <label>Time:</label>
                <br />
                <Input
                  type="time"
                  step="1"
                  value={this.state.airhack.time}
                  onChange={this._handleChange.bind(this, 'time')}
                />
              </div>
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
