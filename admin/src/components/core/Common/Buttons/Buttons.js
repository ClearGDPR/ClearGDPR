import React from 'react';
import PropTypes from 'prop-types';

import './buttons.css';

export const DefaultButton = props => {
  const { onClick, text, buttonState, ...otherProps } = props;
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

export const PrimaryButton = props => {
  const { onClick, text, buttonState, ...otherProps } = props;
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

export const SecondaryButton = props => {
  const { onClick, text, buttonState, ...otherProps } = props;
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
