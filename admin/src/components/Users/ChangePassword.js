import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'react-form';
import TextInput from 'components/core/cards/dashboard/TextInput';
import Loader from 'components/core/cards/dashboard/Loader';

export class ChangePassword extends React.Component {
  static propTypes = {
    isLoading: PropTypes.bool,
    onSubmit: PropTypes.func,
    validatePassword: PropTypes.func,
    touched: PropTypes.object,
    errors: PropTypes.object
  };

  renderForm() {
    return (
      <React.Fragment>
        <TextInput
          label="New password"
          placeholder="*********"
          type={'password'}
          error={
            this.props.touched &&
            this.props.touched['newPassword'] &&
            this.props.errors &&
            this.props.errors['newPassword']
          }
          field="newPassword"
          validate={this.props.validatePassword}
        />
        <TextInput
          label="Repeat new password"
          placeholder="*********"
          type={'password'}
          error={
            this.props.touched &&
            this.props.touched['newPasswordRepeat'] &&
            this.props.errors &&
            this.props.errors['newPasswordRepeat']
          }
          field="newPasswordRepeat"
          validate={this.props.validatePassword}
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
        {...props}
        onSubmit={formApi.submitForm}
        errors={{ ...formApi.errors, ...props.errors }}
        touched={formApi.touched}
      />
    )}
  </Form>
);

changePasswordForm.propTypes = {
  onSubmit: PropTypes.func,
  errors: PropTypes.object
};

export default changePasswordForm;