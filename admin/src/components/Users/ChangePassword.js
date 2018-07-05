import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'informed';

import TextInput from 'components/core/Common/Forms/TextInput';
import Loader from 'components/core/cards/dashboard/Loader';

export class ChangePassword extends React.Component {
  static propTypes = {
    isLoading: PropTypes.bool,
    validatePassword: PropTypes.func,
    touched: PropTypes.object,
    errors: PropTypes.object
  };

  render() {
    return this.props.isLoading ? (
      <Loader />
    ) : (
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
}

const changePasswordForm = props => (
  <Form onSubmit={submittedValues => props.onSubmit(submittedValues)}>
    {({ formState }) => (
      <ChangePassword
        {...props}
        errors={{ ...props.errors, ...formState.errors }}
        touched={formState.touched}
      />
    )}
  </Form>
);

changePasswordForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  errors: PropTypes.object,
  validatePassword: PropTypes.func,
  isLoading: PropTypes.bool
};

export default changePasswordForm;
