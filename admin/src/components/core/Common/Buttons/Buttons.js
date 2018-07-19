import React from 'react';
import PropTypes from 'prop-types';

import './buttons.css';

export const DefaultButton = props => {
  return (
    <button className={`ui-action btn ${props.buttonState}`} onClick={props.onClick}>
      {props.text}
    </button>
  );
};

DefaultButton.propTypes = {
  text: PropTypes.string,
  buttonState: PropTypes.string,
  onClick: PropTypes.func
};

export const PrimaryButton = props => {
  return (
    <button className={`ui-action btn primary ${props.buttonState}`} onClick={props.onClick}>
      {props.text}
    </button>
  );
};

PrimaryButton.propTypes = {
  text: PropTypes.string,
  buttonState: PropTypes.string,
  onClick: PropTypes.func
};

export const SecondaryButton = props => {
  return (
    <button className={`ui-action btn secondary ${props.buttonState}`} onClick={props.onClick}>
      {props.text}
    </button>
  );
};

SecondaryButton.propTypes = {
  text: PropTypes.string,
  buttonState: PropTypes.string,
  onClick: PropTypes.func
};
