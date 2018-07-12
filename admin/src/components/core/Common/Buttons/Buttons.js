import React from 'react';
import PropTypes from 'prop-types';

import './buttons.css';

export const DefaultButton = props => {
  return (
    <button className="ui-action btn" onClick={props.onClick}>
      {props.text}
    </button>
  );
};

DefaultButton.propTypes = {
  text: PropTypes.string,
  onClick: PropTypes.func
};

export const PrimaryButton = props => {
  return (
    <button className="ui-action btn primary" onClick={props.onClick}>
      {props.text}
    </button>
  );
};

PrimaryButton.propTypes = {
  text: PropTypes.string,
  onClick: PropTypes.func
};
