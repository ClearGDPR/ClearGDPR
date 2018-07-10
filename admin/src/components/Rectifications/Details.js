import React from 'react';
import PropTypes from 'prop-types';

import { rectificationDetailsType } from 'types';

import Loader from 'components/core/cards/dashboard/Loader';

const Details = ({ rectification, onApprove, isLoading }) => {
  function renderDetails() {
    return (
      <React.Fragment>
        <p>Created at: {rectification.created_at}</p>
        <p>Current data:</p>
        <pre>{rectification.currentData}</pre>
        <p>Updates:</p>
        <pre>{rectification.updates}</pre>
        <p>Status: {rectification.status}</p>
        <button
          type="button"
          className="btn ui-action"
          onClick={e => {
            e.preventDefault();
            onApprove();
          }}
        >
          Approve
        </button>
      </React.Fragment>
    );
  }
  return isLoading ? <Loader /> : renderDetails();
};

Details.propTypes = {
  rectification: rectificationDetailsType.isRequired,
  onApprove: PropTypes.func.isRequired,
  isLoading: PropTypes.bool
};

export default Details;
