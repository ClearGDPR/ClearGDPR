import React from 'react';
import PropTypes from 'prop-types';

import './buttons.css';

export const DefaultButton = ({ onClick, text, buttonState, ...otherProps }) => {
  return (
    <button className={`ui-action btn ${buttonState}`} onClick={onClick} {...otherProps}>
      {text}
    </button>
  );
};

DefaultButton.propTypes = {
  text: PropTypes.string,
  buttonState: PropTypes.string,
  onClick: PropTypes.func
};

export const PrimaryButton = ({ onClick, text, buttonState, ...otherProps }) => {
  return (
    <button className={`ui-action btn primary ${buttonState}`} onClick={onClick} {...otherProps}>
      {text}
    </button>
  );
};

PrimaryButton.propTypes = {
  text: PropTypes.string,
  buttonState: PropTypes.string,
  onClick: PropTypes.func
};

export const SecondaryButton = ({ onClick, text, buttonState, ...otherProps }) => {
  return (
    <button className={`ui-action btn secondary ${buttonState}`} onClick={onClick} {...otherProps}>
      {text}
    </button>
  );
};

SecondaryButton.propTypes = {
  text: PropTypes.string,
  buttonState: PropTypes.string,
  onClick: PropTypes.func
};
