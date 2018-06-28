import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-responsive-modal';

import Loader from '../core/cards/dashboard/Loader';

const DeleteUser = props => (
  <Modal open={props.isOpen} showCloseIcon={false} onClose={() => {}} center>
    {!props.isLoading ? (
      <React.Fragment>
        Are you sure you want to delete this user?
        <button
          className="btn"
          onClick={e => {
            e.preventDefault();
            props.onCancel();
          }}
        >
          Cancel
        </button>
        <button
          className="btn"
          onClick={e => {
            e.preventDefault();
            props.onConfirm();
          }}
        >
          OK
        </button>
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
