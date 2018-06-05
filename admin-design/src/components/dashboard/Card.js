import React from 'react';

const Card = props => {
  return (
    <article onClick={props.togglePanel} className={`card col-${props.cols}`}>
      <h4>{props.title}</h4>
      {props.children}
    </article>
  );
};

export default Card;
