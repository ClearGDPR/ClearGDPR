import React from 'react';
import PropTypes from 'prop-types';

import ActionBarDialog from './../Dialogs/ActionBarDialog';

import './action-bar.css';

const ActionBar = props => {
  return (
    <div className="action-bar row">
      {props.dialog ? <ActionBarDialog message="I'm a non blocking dialog box" /> : null}
      <div className="text">
        <h4>{props.title}</h4>
        <p>{props.desc}</p>
      </div>
      <div className="spacer" />
      {props.children}
    </div>
  );
};

ActionBar.propTypes = {
  title: PropTypes.string,
  desc: PropTypes.string,
  dialog: PropTypes.bool,
  children: PropTypes.element
};

export default ActionBar;
