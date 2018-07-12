import React from 'react';
import PropTypes from 'prop-types';

import { processorType } from 'types';
import ProcessorCard from 'components/core/cards/dashboard/ProcessorCard';
import Loader from 'components/core/cards/dashboard/Loader';
import * as lodash from 'lodash';

const Processors = ({
  processors,
  onCreateProcessorClick,
  onEditProcessorClick,
  onDeleteProcessorClick,
  isLoading,
  children
}) => {
  function onCreateProcessorHandler() {
    onCreateProcessorClick();
  }

  function onEditProcessorHandler(processor) {
    onEditProcessorClick(processor);
  }

  function onDeleteProcessorHandler(processor) {
    onDeleteProcessorClick(processor);
  }

  let renderProcessors = function() {
    return lodash
      .chunk(processors, 3)
      .map(row => (
        <div className="row">
          {row.map((processor, i) => (
            <ProcessorCard
              key={i}
              data={processor}
              onClick={() => onEditProcessorHandler(processor)}
              onDelete={() => onDeleteProcessorHandler(processor.id)}
            />
          ))}
        </div>
      ));
  };

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
        {isLoading ? (
          <div className="content">
            <Loader />
          </div>
        ) : (
          renderProcessors()
        )}
      </section>
      {children}
    </React.Fragment>
  );
};

Processors.propTypes = {
  processors: PropTypes.arrayOf(processorType),
  onEditProcessorClick: PropTypes.func.isRequired,
  onCreateProcessorClick: PropTypes.func.isRequired,
  onDeleteProcessorClick: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  children: PropTypes.node
};

export default Processors;
