import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'informed';

import TextInput from 'components/core/Common/Forms/TextInput';

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
        <div>
          <input type="submit" className="btn" value="Register" />
        </div>
      </React.Fragment>
    );
  }
}

const registerForm = props => (
  <Form onSubmit={submittedValues => props.onSubmit(submittedValues)}>
    {({ formState }) => (
      <Register
        {...props}
        errors={{ ...formState.errors, ...props.errors }}
        touched={formState.touched}
      />
    )}
  </Form>
);

registerForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  errors: PropTypes.object
};

export default registerForm;
