import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'informed';

import TextInput from 'components/core/Common/Forms/TextInput';
import Loader from 'components/core/cards/dashboard/Loader';
import { PrimaryButton } from 'components/core/Common/Buttons/Buttons';

export class ChangePassword extends React.Component {
  static propTypes = {
    validatePassword: PropTypes.func,
    touched: PropTypes.object,
    errors: PropTypes.object
  };

  render() {
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
          validateOnBlur
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
          validateOnBlur
          validate={this.props.validatePassword}
        />
        <PrimaryButton type="submit" text="Save" />
      </React.Fragment>
    );
  }
}

const changePasswordForm = props => {
  const { errors, validatePassword, isLoading, ...formProps } = props;

  return isLoading ? (
    <Loader />
  ) : (
    <Form onSubmit={submittedValues => props.onSubmit(submittedValues)} {...formProps}>
      {({ formState }) => (
        <ChangePassword
          errors={{ ...errors, ...formState.errors }}
          touched={formState.touched}
          validatePassword={validatePassword}
        />
      )}
    </Form>
  );
};

changePasswordForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  errors: PropTypes.object,
  validatePassword: PropTypes.func,
  isLoading: PropTypes.bool
};

export default changePasswordForm;
