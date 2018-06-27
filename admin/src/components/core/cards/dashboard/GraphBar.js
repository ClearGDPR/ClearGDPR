import React from 'react';
import PropTypes from 'prop-types';

const GraphBar = props => {
  return (
    <div className="bar">
      <div className="inner-bar" style={{ width: props.width + '%' }} />
    </div>
  );
};

GraphBar.propTypes = {
  width: PropTypes.number
};

export default GraphBar;
