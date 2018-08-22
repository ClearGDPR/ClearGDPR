import React from 'react';
import PropTypes from 'prop-types';
import lodash from 'lodash';

import { rectificationDetailsType } from 'types';

import Loader from 'components/core/cards/dashboard/Loader';
import { PrimaryButton } from 'components/core/Common/Buttons/Buttons';

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
        {rectification.status !== 'APPROVED' && (
          <PrimaryButton
            type="button"
            onClick={e => {
              e.preventDefault();
              onApprove();
            }}
            text="Approve"
          />
        )}
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
