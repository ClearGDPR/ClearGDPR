import React from 'react';
import PropTypes from 'prop-types';

import ProcessorCard from './ProcessorCard';
import ActionBar from './../../Common/Bars/ActionBar';
import { DefaultButton } from './../../Common/Buttons/Buttons';

const Processors = props => {
  return (
    <React.Fragment>
      <section className="cards">
        <ActionBar title={props.title} desc={props.desc} handleClick={props.onClick} dialog>
          <DefaultButton text="Add processor" onClick={props.onClick} />
        </ActionBar>
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
