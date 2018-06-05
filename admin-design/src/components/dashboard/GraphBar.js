import React from 'react';

const GraphBar = props => {
  return (
    <div className="bar">
      <div className="inner-bar" style={{ width: props.width + '%' }} />
    </div>
  );
};

export default GraphBar;
