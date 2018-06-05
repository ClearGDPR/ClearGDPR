import React from 'react';

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

export default Icon;
