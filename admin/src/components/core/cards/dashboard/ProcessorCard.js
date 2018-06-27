import React from 'react';
import Card from './Card';
import defaultLogo from './../../../../assets/logo.png';

const ProcessorCard = props => {
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
      </div>
    </Card>
  );
};

export default ProcessorCard;
