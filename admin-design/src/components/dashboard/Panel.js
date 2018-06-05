import React from 'react';

const Panel = props => {
  return (
    <React.Fragment>
      <aside
        className={props.isPanelOpen ? 'details-panel' : 'details-panel closed'}
      >
        <button className="ui-action btn" onClick={props.closePanel}>
          Close
        </button>
        <h3>{props.data.title}</h3>
      </aside>
    </React.Fragment>
  );
};

export default Panel;
