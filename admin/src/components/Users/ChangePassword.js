import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'react-form';
import TextInput from '../core/cards/dashboard/TextInput';
import Loader from '../core/cards/dashboard/Loader';

export class ChangePassword extends React.Component {
  static propTypes = {
    isLoading: PropTypes.bool,
    onSubmit: PropTypes.func,
    touched: PropTypes.object,
    errors: PropTypes.object
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

  renderForm() {
    return (
      <React.Fragment>
        <TextInput
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
      </React.Fragment>
    );
  }

  render() {
    return (
      <form onSubmit={this.props.onSubmit}>
        {this.props.isLoading ? <Loader /> : this.renderForm()}
      </form>
    );
  }
}

const changePasswordForm = props => (
  <Form onSubmit={submittedValues => props.onSubmit && props.onSubmit(submittedValues)}>
    {formApi => (
      <ChangePassword
        onSubmit={formApi.submitForm}
        errors={formApi.errors}
        touched={formApi.touched}
        {...props}
      />
    )}
  </Form>
);

changePasswordForm.propTypes = {
  onSubmit: PropTypes.func
};

export default changePasswordForm;
