import React from 'react';
import PropTypes from 'prop-types';

const Delete = ({ onDelete, onCancel }) => (
  <React.Fragment>
    <p>Are you sure you want to delete this item? This action cannot be rolled back.</p>
    <div style={{ marginTop: 20 }}>
      <button onClick={onCancel} className="button">
        Go back
      </button>
      &nbsp;
      <button onClick={onDelete} className="button is-danger">
        {"I'm sure"}
      </button>
    </div>
  </React.Fragment>
);

Delete.propTypes = {
  onDelete: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};

export default Delete;
