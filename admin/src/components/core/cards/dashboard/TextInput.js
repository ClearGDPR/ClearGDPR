import React from 'react';

const TextInput = props => {
  return (
    <div className={props.error ? 'input-field input-error' : 'input-field'}>
      <label htmlFor={props.for}>{props.label}</label>
      {props.error ? <span className="error-msg">{props.errorMessage}</span> : ''}
      <input type="text" id={props.for} name={props.for} placeholder={props.placeholder} />
    </div>
  );
};

export default TextInput;
