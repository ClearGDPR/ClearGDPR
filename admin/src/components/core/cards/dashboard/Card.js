import React from 'react';
import PropTypes from 'prop-types';

const Card = props => {
  function onArticleClick(e) {
    e.preventDefault();
    if (!props.onClick) return;
    props.onClick();
  }

  return (
    <article onClick={onArticleClick} className={`card col-${props.cols}`}>
      <h4>{props.title}</h4>
      {props.children}
    </article>
  );
};

Card.propTypes = {
  onClick: PropTypes.func,
  cols: PropTypes.number.isRequired,
  title: PropTypes.string,
  children: PropTypes.element
};

export default Card;
