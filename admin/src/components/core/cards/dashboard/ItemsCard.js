import React from 'react';
import PropTypes from 'prop-types';

import Card from 'components/core/cards/dashboard/Card';
import GraphBar from 'components/core/cards/dashboard/GraphBar';

const ItemsCard = props => {
  console.log(props);
  return (
    <Card size={props.size} cols={props.cols} title={props.title} onClick={props.onClick}>
      <div className="row items-container">
        {props.data.map(({ name, fillPercent }, id) => {
          return (
            <div className="item" key={id}>
              <p className="number">{fillPercent}%</p>
              <GraphBar width={fillPercent} />
              <p className="name">{name}</p>
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
  fillPercent: PropTypes.number,
  name: PropTypes.string,
  onClick: PropTypes.func
};

export default ItemsCard;
