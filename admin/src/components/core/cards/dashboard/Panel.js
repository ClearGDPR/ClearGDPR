import React from 'react';
import PropTypes from 'prop-types';
import { DefaultButton } from 'components/core/Common/Buttons/Buttons';

const Panel = props => {
  return (
    <React.Fragment>
      <aside className={props.isPanelOpen ? 'details-panel' : 'details-panel closed'}>
        <DefaultButton onClick={props.onCloseClick} text="Close" />
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
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
};

export default Panel;
