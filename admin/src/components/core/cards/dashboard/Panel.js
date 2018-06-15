import React from 'react';
import PropTypes from 'prop-types';

const Panel = props => {
  return (
    <React.Fragment>
      <aside className={props.isPanelOpen ? 'details-panel' : 'details-panel closed'}>
        <button className="ui-action btn" onClick={props.onCloseClick}>
          Close
        </button>
        <h3>{props.title}</h3>
        {props.content}
      </aside>
    </React.Fragment>
  );
};

Panel.propTypes = {
  isPanelOpen: PropTypes.bool.isRequired,
  onCloseClick: PropTypes.func.isRequired,
  title: PropTypes.string,
  content: PropTypes.element
};

export default Panel;
