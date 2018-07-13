import React from 'react';
import PropTypes from 'prop-types';
import * as lodash from 'lodash';

import { processorType } from 'types';
import ProcessorCard from 'components/core/cards/dashboard/ProcessorCard';
import Loader from 'components/core/cards/dashboard/Loader';
import { DefaultButton } from 'components/core/Common/Buttons/Buttons';
import ActionBar from 'components/core/Common/Bars/ActionBar';

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

  function renderProcessors() {
    return lodash.chunk(processors, 3).map((row, rowIndex) => (
      <div className="row" key={rowIndex}>
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
  }

  return (
    <React.Fragment>
      <section className="cards">
        <ActionBar
          title="Processors"
          desc={
            <React.Fragment>
              A processor is a third-party with access to your users data.<br />You can manage from
              here which are enabled or not, and which actions are allowed to access.
            </React.Fragment>
          }
        >
          <DefaultButton text="+ Add Processor" onClick={onCreateProcessorHandler} />
        </ActionBar>
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
