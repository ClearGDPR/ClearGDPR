import React from 'react';
import ProcessorCard from './ProcessorCard';

const Processors = props => {
  const { processors } = props;

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
          {processors.map((processor, id) => {
            return <ProcessorCard key={id} data={processor} onClick={props.onClick} />;
          })}
        </div>
      </section>
    </React.Fragment>
  );
};

export default Processors;
