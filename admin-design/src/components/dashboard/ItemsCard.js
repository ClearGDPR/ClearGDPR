import React from 'react';
import Card from './Card';
import GraphBar from './GraphBar';

const ItemsCard = props => {
  return (
    <Card
      size={props.size}
      cols={props.cols}
      title={props.title}
      togglePanel={props.togglePanel}
    >
      <div className="row items-container">
        {props.data.map((processor, id) => {
          return (
            <div className="item" key={id}>
              <p className="number">{processor.consented}%</p>
              <GraphBar width={processor.consented} />
              <p className="name">{processor.name}</p>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default ItemsCard;
