import React from 'react';
import PropTypes from 'prop-types';

import Card from './Card';
import defaultLogo from 'assets/logo.png';

const ProcessorCard = props => {
  function onDeleteHandler(e, processor) {
    e.stopPropagation();
    props.onDelete && props.onDelete(processor);
  }

  return (
    <Card cols={3} onClick={props.onClick}>
      <div className="processor">
        <div className="image-container">
          {props.data.logoUrl ? (
            <img src={props.data.logoUrl} alt={props.data.name} />
          ) : (
            <img src={defaultLogo} alt={props.data.name} />
          )}
        </div>
        <p>{props.data.description}</p>
        <p>
          <strong>Scopes:</strong>
        </p>
        <ul>
          {props.data.scopes.map((data, id) => {
            return <li key={id}>{data}</li>;
          })}
        </ul>
        <button className="btn" onClick={e => onDeleteHandler(e, props.data)}>
          Delete
        </button>
      </div>
    </Card>
  );
};

ProcessorCard.propTypes = {
  data: PropTypes.shape({
    logoUrl: PropTypes.string,
    name: PropTypes.string,
    description: PropTypes.string,
    scopes: PropTypes.arrayOf(PropTypes.string)
  }),
  onClick: PropTypes.func,
  onDelete: PropTypes.func
};

export default ProcessorCard;
