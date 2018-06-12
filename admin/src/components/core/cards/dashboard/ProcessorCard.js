import React from 'react';
import Card from './Card';

const ProcessorCard = props => {
  return (
    <Card cols="3" togglePanel={props.togglePanel}>
      <div className="processor">
        <div className="image-container">
          <img src={props.data.img} alt="" />
        </div>
        <p>{props.data.description}</p>
        <p>
          <strong>Scope:</strong>
        </p>
        <ul>
          {props.data.scope.map((data, id) => {
            return <li key={id}>{data}</li>;
          })}
        </ul>
      </div>
    </Card>
  );
};

export default ProcessorCard;
