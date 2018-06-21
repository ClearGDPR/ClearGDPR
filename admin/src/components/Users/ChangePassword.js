import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'react-form';
import TextInput from '../core/cards/dashboard/TextInput';

export class ChangePassword extends React.Component {
  static propTypes = {
    onSubmit: PropTypes.func,
    touched: PropTypes.array,
    errors: PropTypes.array
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

  render() {
    return (
      <form onSubmit={this.props.onSubmit}>
        <TextInput
          value={this.state.newPassword.text}
          label="New password"
          placeholder="*********"
          error={
            this.props.touched &&
            this.props.touched['newPassword'] &&
            this.props.errors &&
            this.props.errors['newPassword']
          }
          field="newPassword"
          validate={this.validatePassword}
        />
        <TextInput
          value={this.state.newPasswordRepeat.text}
          label="Repeat new password"
          placeholder="*********"
          error={
            this.props.touched &&
            this.props.touched['newPasswordRepeat'] &&
            this.props.errors &&
            this.props.errors['newPasswordRepeat']
          }
          field="newPasswordRepeat"
          validate={this.validatePassword}
        />
        <div>
          <input type="submit" className="btn" value="Save" />
        </div>
      </form>
    );
  }
}

const changePasswordForm = ({ onSubmit }) => (
  <Form onSubmit={submittedValues => onSubmit && onSubmit(submittedValues)}>
    {formApi => (
      <ChangePassword
        onSubmit={formApi.submitForm}
        errors={formApi.errors}
        touched={formApi.touched}
      />
    )}
  </Form>
);

changePasswordForm.propTypes = {
  onSubmit: PropTypes.func
};

export default changePasswordForm;
