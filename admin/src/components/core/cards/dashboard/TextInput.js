import React from 'react';
import PropTypes from 'prop-types';

const TextInput = props => {
  const onChange = e => {
    e.preventDefault();
    props.onTextChange && props.onTextChange(e.target.value);
  };

  return (
    <div className={props.error ? 'input-field input-error' : 'input-field'}>
      <label htmlFor={props.for}>{props.label}</label>
      {props.error ? <span className="error-msg">{props.errorMessage}</span> : ''}
      <input
        type={props.type || 'text'}
        id={props.for}
        name={props.for}
        placeholder={props.placeholder}
        value={props.value}
        onChange={onChange}
      />
    </div>
  );
};

TextInput.propTypes = {
  error: PropTypes.bool,
  errorMessage: PropTypes.string,
  label: PropTypes.string,
  for: PropTypes.string,
  value: PropTypes.string,
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
  onTextChange: PropTypes.func
};

export default TextInput;
