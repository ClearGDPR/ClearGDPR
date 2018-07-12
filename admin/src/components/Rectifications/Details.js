import React from 'react';
import PropTypes from 'prop-types';
import lodash from 'lodash';

import { rectificationDetailsType } from 'types';

import Loader from 'components/core/cards/dashboard/Loader';

const Details = ({ rectification, onApprove, isLoading }) => {
  function renderObject(obj, level = 0) {
    if (!obj) return;

    return Object.keys(obj).map((k, index) => (
      <React.Fragment key={index}>
        {level ? <br /> : ''}
        {[...Array(level)].map((value, arrayIndex) => (
          <React.Fragment key={arrayIndex}>&nbsp;&nbsp;</React.Fragment>
        ))}
        {k}:&nbsp;
        {lodash.isObject(obj[k]) ? renderObject(obj[k], level + 1) : obj[k]}
        {!level ? <br /> : ''}
      </React.Fragment>
    ));
  }

  function renderDetails() {
    return (
      <React.Fragment>
        <p>
          <strong>Created at:</strong> {rectification.created_at}
        </p>
        <p>
          <strong>Current data:</strong>
        </p>
        <p>{renderObject(rectification.currentData)}</p>
        <p>
          <strong>Updates:</strong>
        </p>
        <p>{renderObject(rectification.updates)}</p>
        <p>Status: {rectification.status}</p>
        <button
          type="button"
          className="btn"
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
