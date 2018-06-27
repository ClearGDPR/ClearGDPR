import React from 'react';
import PropTypes from 'prop-types';
import { Form, Text, TextArea, Checkbox } from 'react-form';

import Loader from '../core/cards/dashboard/Loader';

export const EditProcessor = props => {
  const scopes = {
    'Full Name': 'user.fullName',
    Email: 'user.email',
    'Phone Number': 'user.phoneNumber'
  };

  const renderForm = () => (
    <React.Fragment>
      <label htmlFor="name">Name:</label>
      <Text field="name" id="name" />

      <label htmlFor="description">Description:</label>
      <TextArea field="description" id="description" />

      <label htmlFor="logoUrl">Logo URL:</label>
      <Text field="logoUrl" id="logoUrl" />

      <label>Scopes:</label>
      {Object.keys(scopes).map((scope, i) => <Checkbox key={i} field={`scope[${scope}]`} />)}

      <button type="submit" className="btn">
        Submit
      </button>
    </React.Fragment>
  );

  return <form onSubmit={props.onSubmit}>{props.isLoading ? <Loader /> : renderForm()}</form>;
};

EditProcessor.propTypes = {
  isLoading: PropTypes.bool,
  onSubmit: PropTypes.func,
  touched: PropTypes.object,
  errors: PropTypes.object
};

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
