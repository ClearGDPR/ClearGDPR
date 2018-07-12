import React from 'react';
import PropTypes from 'prop-types';
import { Form, TextArea, Scope, Checkbox } from 'informed';

import TextInput from 'components/core/Common/Forms/TextInput';
import Loader from 'components/core/cards/dashboard/Loader';

// TODO: this should be fetch from configuration service
const DEMO_SCOPES = ['user:fullName', 'user:email', 'user:phoneNumber'];

export class EditProcessor extends React.Component {
  static propTypes = {
    onSetValues: PropTypes.func,
    values: PropTypes.object,
    touched: PropTypes.object,
    errors: PropTypes.object
  };

  componentDidMount() {
    // TODO: This should be probably a helper function, and define a domain entity
    if (this.props.values && this.props.onSetValues) {
      const values = Object.assign({}, this.props.values);
      values.scopes = values.scopes.reduce((scopes, s) => {
        scopes[s] = true;
        return scopes;
      }, {});
      this.props.onSetValues(values);
    }
  }

  render() {
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
        <Scope scope="scopes">
          {DEMO_SCOPES.map((scope, i) => (
            <div key={i}>
              <Checkbox field={`${scope}`} id={`scopes-${scope}`} />
              <label key={i} htmlFor={`scopes-${scope}`}>
                {scope}
              </label>
            </div>
          ))}
        </Scope>
        <button type="submit" className="btn ui-action">
          Submit
        </button>
      </React.Fragment>
    );
  }
}

const EditProcessorForm = props => {
  const { errors, values, isLoading, ...formProps } = props;

  return isLoading ? (
    <Loader />
  ) : (
    <Form onSubmit={submittedValues => props.onSubmit(submittedValues)} {...formProps}>
      {({ formApi, formState }) => (
        <EditProcessor
          onSetValues={formApi.setValues}
          errors={{ ...errors, ...formState.errors }}
          values={values}
          touched={formState.touched}
        />
      )}
    </Form>
  );
};

EditProcessorForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  errors: PropTypes.object,
  values: PropTypes.object,
  isLoading: PropTypes.bool
};

export default EditProcessorForm;
