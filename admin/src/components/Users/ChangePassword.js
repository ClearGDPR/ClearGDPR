import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'react-form';
import TextInput from '../core/cards/dashboard/TextInput';

class ChangePassword extends React.Component {
  static propTypes = {
    onSubmit: PropTypes.func
  };

  state = {
    newPassword: {
      text: '',
      error: null
    },
    newPasswordRepeat: {
      text: '',
      error: null
    }
  };

  validatePassword(password) {
    // TODO: todo add proper validation
    if (!password) {
      return {
        error: 'Field required'
      };
    }
    if (password.length < 8) {
      return {
        error: 'Password must have min. 8 characters'
      };
    }
    return {
      success: null
    };
  }

  onSubmit(submittedValues) {
    this.props.onSubmit && this.props.onSubmit(submittedValues);
  }

  render() {
    return (
      <Form onSubmit={submittedValues => this.onSubmit(submittedValues)}>
        {formApi => (
          <form onSubmit={formApi.submitForm}>
            <TextInput
              value={this.state.newPassword.text}
              label="New password"
              placeholder="*********"
              error={
                formApi.touched &&
                formApi.touched['newPassword'] &&
                formApi.errors &&
                formApi.errors['newPassword']
              }
              field="newPassword"
              validate={this.validatePassword}
            />
            <TextInput
              value={this.state.newPasswordRepeat.text}
              label="Repeat new password"
              placeholder="*********"
              error={
                formApi.touched &&
                formApi.touched['newPasswordRepeat'] &&
                formApi.errors &&
                formApi.errors['newPasswordRepeat']
              }
              field="newPasswordRepeat"
              validate={this.validatePassword}
            />
            <div>
              <input type="submit" className="btn" value="Save" />
            </div>
          </form>
        )}
      </Form>
    );
  }
}

ChangePassword.propTypes = {
  onSubmit: PropTypes.func
};

export default ChangePassword;
