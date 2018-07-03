import React from 'react';
import PropTypes from 'prop-types';

import Loader from 'components/core/cards/dashboard/Loader';

const Rectifications = ({ isLoading }) => {
  return (
    <section className="cards">
      <div className="action-bar">
        <div className="text">
          <h4>Rectification requests</h4>
          <p>
            Here you can manage requests from users who want to execute their right to rectify the
            data stored about them.
          </p>
        </div>
      </div>
      <div className="row">
        <div className="content">{!isLoading ? <div>text</div> : <Loader />}</div>
      </div>
    </section>
  );
};

Rectifications.propTypes = {
  isLoading: PropTypes.bool
};

export default Rectifications;
