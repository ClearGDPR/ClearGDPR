import React from 'react';
import PropTypes from 'prop-types';

import Card from './Card';
import Icon from './Icon';
import IconUp from './../../../../assets/icons/up-arrow.svg';
import IconDown from './../../../../assets/icons/down-arrow.svg';

const NumberCard = props => {
  return (
    <Card size={props.size} cols={props.cols} title={props.data.title} onClick={props.onClick}>
      <div className="content">
        {props.data.change > 0 ? (
          <div className="indicator up">
            <Icon src={IconUp} />
          </div>
        ) : (
          <div className="indicator down">
            <Icon src={IconDown} />
          </div>
        )}

        <div className="data">
          <p className="numbers">{props.data.number}</p>
          <p className="description">
            <em>
              <small>
                {props.data.change > 0 ? 'Increased' : 'Decreased'} by {Math.abs(props.data.change)}%
              </small>
            </em>
          </p>
        </div>
      </div>
    </Card>
  );
};

NumberCard.propTypes = {
  size: PropTypes.number,
  cols: PropTypes.number,
  data: PropTypes.shape({
    title: PropTypes.string,
    change: PropTypes.number,
    number: PropTypes.number
  }),
  onClick: PropTypes.func
};

export default NumberCard;
