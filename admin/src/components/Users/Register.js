import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'informed';
import TextInput from 'components/core/Common/Forms/TextInput';
import Loader from 'components/core/cards/dashboard/Loader';

export class Register extends React.Component {
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

  render() {
    return (
      <form onSubmit={this.props.onSubmit}>
        {this.props.isLoading ? <Loader /> : this.renderForm()}
      </form>
    );
  }
}

const registerForm = props => (
  <Form onSubmit={submittedValues => props.onSubmit && props.onSubmit(submittedValues)}>
    {formApi => (
      <Register
        {...props}
        onSubmit={formApi.submitForm}
        errors={{ ...formApi.errors, ...props.errors }}
        touched={formApi.touched}
      />
    )}
  </Form>
);

registerForm.propTypes = {
  onSubmit: PropTypes.func,
  errors: PropTypes.object
};

export default registerForm;
