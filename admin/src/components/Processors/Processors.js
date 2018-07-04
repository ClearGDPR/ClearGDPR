import React from 'react';
import PropTypes from 'prop-types';

import ProcessorCard from 'components/core/cards/dashboard/ProcessorCard';
import Loader from 'components/core/cards/dashboard/Loader';

const Processors = ({
  processors,
  onCreateProcessorClick,
  onEditProcessorClick,
  onDeleteProcessorClick,
  isLoading,
  children
}) => {
  function onCreateProcessorHandler() {
    onCreateProcessorClick && onCreateProcessorClick();
  }

  function onEditProcessorHandler(processor) {
    onEditProcessorClick && onEditProcessorClick(processor);
  }

  function onDeleteProcessorHandler(processor) {
    onDeleteProcessorClick && onDeleteProcessorClick(processor);
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
          <button className="ui-action btn" onClick={e => onCreateProcessorHandler(e)}>
            + Add Processor
          </button>
        </div>
        <div className="row">
          <div className="content">
            {!isLoading ? (
              processors.map((processor, i) => (
                <ProcessorCard
                  key={i}
                  data={processor}
                  onClick={() => onEditProcessorHandler(processor)}
                  onDelete={() => onDeleteProcessorHandler(processor.id)}
                />
              ))
            ) : (
              <Loader />
            )}
          </div>
        </div>
      </section>
      {children}
    </React.Fragment>
  );
};

Processors.propTypes = {
  processors: PropTypes.arrayOf(PropTypes.object),
  onEditProcessorClick: PropTypes.func,
  onCreateProcessorClick: PropTypes.func,
  onDeleteProcessorClick: PropTypes.func,
  isLoading: PropTypes.bool,
  children: PropTypes.node
};

export default Processors;
