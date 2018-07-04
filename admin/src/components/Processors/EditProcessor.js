import React from 'react';
import PropTypes from 'prop-types';
import { Form, TextArea, Checkbox } from 'informed';

import TextInput from '../core/cards/dashboard/TextInput';
import Loader from '../core/cards/dashboard/Loader';

// TODO: this should be fetch from configuration service
const DEMO_SCOPES = ['user:fullName', 'user:email', 'user:phoneNumber'];

export class EditProcessor extends React.Component {
  static propTypes = {
    isLoading: PropTypes.bool,
    onSetValues: PropTypes.func,
    onSubmit: PropTypes.func,
    values: PropTypes.object,
    touched: PropTypes.object,
    errors: PropTypes.object
  };

  componentDidMount() {
    if (this.props.values && this.props.onSetValues) {
      const values = Object.assign({}, this.props.values);
      values.scopes = values.scopes.reduce((scopes, s) => {
        scopes[s] = true;
        return scopes;
      }, {});
      this.props.onSetValues(values);
    }
  }

  renderForm() {
    return (
      <React.Fragment>
        <TextInput
          label="Processor name"
          placeholder="Processor name"
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
          placeholder="Processor Logo (URL)"
          type={'url'}
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
        {DEMO_SCOPES.map((scope, i) => (
          <label key={i}>
            <Checkbox field={`scopes[${DEMO_SCOPES[i]}]`} />
            {scope}
          </label>
        ))}
        <button type="submit" className="btn ui-action">
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
        onSetValues={formApi.setAllValues}
        onSubmit={formApi.submitForm}
        errors={{ ...formApi.errors, ...props.errors }}
        touched={formApi.touched}
        values={props.values}
      />
    )}
  </Form>
);

EditProcessorForm.propTypes = {
  onSubmit: PropTypes.func,
  errors: PropTypes.object,
  values: PropTypes.object
};

export default EditProcessorForm;
