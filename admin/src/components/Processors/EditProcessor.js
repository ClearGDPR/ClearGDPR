import React from 'react';
import PropTypes from 'prop-types';
import { Form, TextArea, Checkbox } from 'react-form';

import TextInput from '../core/cards/dashboard/TextInput';
import Loader from '../core/cards/dashboard/Loader';

// TODO: this should be fetch from configuration service
const DEMO_SCOPES = {
  'Full Name': 'user.fullName',
  Email: 'user.email',
  'Phone Number': 'user.phoneNumber'
};

export class EditProcessor extends React.Component {
  static propTypes = {
    isLoading: PropTypes.bool,
    onSubmit: PropTypes.func,
    touched: PropTypes.object,
    errors: PropTypes.object
  };

  renderForm() {
    return (
      <React.Fragment>
        <TextInput
          label="Name"
          placeholder="*********"
          type={'text'}
          error={
            this.props.touched &&
            this.props.touched['name'] &&
            this.props.errors &&
            this.props.errors['name']
          }
          field="name"
          required
        />

        <label htmlFor="description">Description:</label>
        <TextArea field="description" id="description" />

        <TextInput
          label="Logo URL"
          placeholder="*********"
          type={'text'}
          error={
            this.props.touched &&
            this.props.touched['logoUrl'] &&
            this.props.errors &&
            this.props.errors['logoUrl']
          }
          field="logoUrl"
          required
        />

        <label>Scopes:</label>
        {Object.keys(DEMO_SCOPES).map((scope, i) => <Checkbox key={i} field={`scope[${scope}]`} />)}

        <button type="submit" className="btn">
          Submit
        </button>
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

const EditProcessorForm = props => (
  <Form onSubmit={submittedValues => props.onSubmit && props.onSubmit(submittedValues)}>
    {formApi => (
      <EditProcessor
        {...props}
        onSubmit={formApi.submitForm}
        errors={{ ...formApi.errors, ...props.errors }}
        touched={formApi.touched}
      />
    )}
  </Form>
);

EditProcessorForm.propTypes = {
  onSubmit: PropTypes.func,
  errors: PropTypes.object
};

export default EditProcessorForm;
