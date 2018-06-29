import React from 'react';
import PropTypes from 'prop-types';

import ProcessorCard from 'components/core/cards/dashboard/ProcessorCard';
import Loader from 'components/core/cards/dashboard/Loader';

const Processors = ({ processors, onEditProcessorClick, isLoading }) => {
  function onEditProcessorClickHandler(e, id) {
    console.log({ e, id });
  }

  return (
    <React.Fragment>
      <section className="cards">
        <div className="action-bar">
          <div className="text">
            <h4>Processors</h4>
            <p>
              A processor is a third-party with access to your users data. You can manage from here
              which are enabled or not, and which actions are allowed to access.
            </p>
          </div>
          <div className="spacer" />
          {/* <button className="ui-action btn" onClick={props.onClick}>
            + Add Processor
          </button> */}
        </div>
        <div className="row">
          <div className="content">
            {!isLoading ? (
              processors.map((processor, i) => (
                <ProcessorCard
                  key={i}
                  data={processor}
                  onClick={e => onEditProcessorClickHandler(e, processor.id)}
                />
              ))
            ) : (
              <Loader />
            )}
          </div>
        </div>
      </section>
    </React.Fragment>
  );
};

Processors.propTypes = {
  processors: PropTypes.arrayOf(PropTypes.object),
  onEditProcessorClick: PropTypes.func,
  isLoading: PropTypes.bool
};

export default Processors;
