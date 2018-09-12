import React from 'react';
import PropTypes from 'prop-types';

const Card = props => {
  function onArticleClick(e) {
    e.preventDefault();
    props.onClick && props.onClick();
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
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  children: PropTypes.element
};

Card.defaultProps = {
  cols: 12
};

export default Card;
