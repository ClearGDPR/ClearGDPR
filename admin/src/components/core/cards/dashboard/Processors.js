import React from 'react';
import PropTypes from 'prop-types';

import ProcessorCard from './ProcessorCard';

const Processors = props => {
  return (
    <React.Fragment>
      <section className="cards">
        <div className="action-bar row">
          <div className="text">
            <h4>{props.title}</h4>
            <p>{props.desc}</p>
          </div>
          <div className="spacer" />
          <button className="ui-action btn" onClick={props.onClick}>
            + Add Processor
          </button>
        </div>
        <div className="row">
          {props.processors.map((processor, id) => {
            return <ProcessorCard key={id} data={processor} onClick={props.onClick} />;
          })}
        </div>
      </section>
    </React.Fragment>
  );
};

Processors.propTypes = {
  title: PropTypes.string,
  desc: PropTypes.string,
  processors: PropTypes.arrayOf(
    PropTypes.shape({
      logoUrl: PropTypes.string,
      name: PropTypes.string,
      description: PropTypes.string,
      scopes: PropTypes.arrayOf(PropTypes.string)
    })
  ),
  onClick: PropTypes.func
};

export default Processors;
