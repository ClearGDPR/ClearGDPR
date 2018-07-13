import React from 'react';
import PropTypes from 'prop-types';

import { DefaultButton, PrimaryButton } from './../Buttons/Buttons';

import './dialogs.css';

const ActionBarDialog = props => {
  return (
    <article className="action-dialog">
      <p>{props.message}</p>
      <div className="spacer" />
      <DefaultButton text="Undo" />
      <PrimaryButton text="Confirm" />
    </article>
  );
};

ActionBarDialog.propTypes = {
  message: PropTypes.string
};

export default ActionBarDialog;
