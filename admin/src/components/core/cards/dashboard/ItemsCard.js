import React from 'react';
import PropTypes from 'prop-types';

import Card from './Card';
import GraphBar from './GraphBar';

const ItemsCard = props => {
  return (
    <Card size={props.size} cols={props.cols} title={props.title} onClick={props.onClick}>
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

ItemsCard.propTypes = {
  size: PropTypes.number,
  cols: PropTypes.number,
  title: PropTypes.string,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      consented: PropTypes.number
    })
  ),
  onClick: PropTypes.func
};

export default ItemsCard;
