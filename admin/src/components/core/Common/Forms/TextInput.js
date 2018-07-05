import React from 'react';
import { Text } from 'informed';
import PropTypes from 'prop-types';

const TextInput = props => {
  return (
    <div className={props.error ? 'input-field input-error' : 'input-field'}>
      <label htmlFor={props.field}>{props.label}</label>
      {props.error ? <span className="error-msg">{props.error}</span> : null}
      <Text
        type={props.type || 'text'}
        id={props.field}
        placeholder={props.placeholder}
        validate={props.validate}
        field={props.field}
        autoComplete="off"
        required={props.required}
        defaultValue={props.defaultValue}
      />
    </div>
  );
};

TextInput.propTypes = {
  error: PropTypes.string,
  label: PropTypes.string,
  field: PropTypes.string,
  type: PropTypes.oneOf([
    'text',
    'password',
    'color',
    'date',
    'datetime-local',
    'email',
    'month',
    'number',
    'range',
    'search',
    'tel',
    'time',
    'url',
    'week'
  ]),
  placeholder: PropTypes.string,
  validate: PropTypes.func,
  required: PropTypes.bool,
  defaultValue: PropTypes.any
};

export default TextInput;
