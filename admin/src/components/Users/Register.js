import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'informed';

import TextInput from 'components/core/Common/Forms/TextInput';
import Loader from 'components/core/cards/dashboard/Loader';
import { PrimaryButton } from 'components/core/Common/Buttons/Buttons';

export class Register extends React.Component {
  static propTypes = {
    validatePassword: PropTypes.func,
    touched: PropTypes.object,
    errors: PropTypes.object
  };

  render() {
    return (
      <React.Fragment>
        <TextInput
          label="Username"
          placeholder="mick.bern"
          error={
            this.props.touched &&
            this.props.touched['username'] &&
            this.props.errors &&
            this.props.errors['username']
          }
          field="username"
          required
        />
        <TextInput
          label="New password"
          placeholder="*********"
          type={'password'}
          error={
            this.props.touched &&
            this.props.touched['password'] &&
            this.props.errors &&
            this.props.errors['password']
          }
          field="password"
          validate={this.props.validatePassword}
        />
        <PrimaryButton type="submit" className="btn" text="Register" />
      </React.Fragment>
    );
  }
}

const registerForm = props => {
  const { errors, validatePassword, isLoading, ...formProps } = props;

  return isLoading ? (
    <Loader />
  ) : (
    <Form onSubmit={submittedValues => props.onSubmit(submittedValues)} {...formProps}>
      {({ formState }) => (
        <Register
          errors={{ ...errors, ...formState.errors }}
          touched={formState.touched}
          validatePassword={validatePassword}
        />
      )}
    </Form>
  );
};

registerForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  errors: PropTypes.object,
  validatePassword: PropTypes.func,
  isLoading: PropTypes.bool
};

export default registerForm;
