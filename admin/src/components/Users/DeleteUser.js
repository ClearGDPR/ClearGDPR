import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-responsive-modal';

import Loader from '../core/cards/dashboard/Loader';

const DeleteUser = props => (
  <Modal open={props.isOpen} showCloseIcon={false} onClose={() => {}} center>
    {!props.isLoading ? (
      <React.Fragment>
        <p>Are you sure you want to delete this user?</p>
        <p>
          <button
            className="ui-action btn"
            onClick={e => {
              e.preventDefault();
              props.onCancel();
            }}
          >
            Cancel
          </button>
          <button
            className="ui-action btn"
            onClick={e => {
              e.preventDefault();
              props.onConfirm();
            }}
          >
            OK
          </button>
        </p>
      </React.Fragment>
    ) : (
      <Loader />
    )}
  </Modal>
);

DeleteUser.propTypes = {
  onConfirm: PropTypes.func,
  onCancel: PropTypes.func,
  isOpen: PropTypes.bool,
  isLoading: PropTypes.bool
};

export default DeleteUser;
