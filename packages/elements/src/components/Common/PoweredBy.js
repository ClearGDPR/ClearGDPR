import React from 'react';
import PropTypes from 'prop-types';

const PoweredBy = props => <div size={props.size}>Powered By ClearGDPR</div>;

PoweredBy.propTypes = {
  size: PropTypes.string
};

export default PoweredBy;
