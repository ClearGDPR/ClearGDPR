import React from 'react';
import PropTypes from 'prop-types';

const Icon = props => {
  return (
    <img
      src={props.src}
      alt={`${props.name} icon`}
      onClick={props.action}
      className={props.action ? 'ui-action icon' : ''}
    />
  );
};

Icon.propTypes = {
  src: PropTypes.string,
  name: PropTypes.string,
  action: PropTypes.func
};

export default Icon;
