import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-responsive-modal';

import Loader from 'components/core/cards/dashboard/Loader';
import { PrimaryButton } from 'components/core/Common/Buttons/Buttons';

const DeleteUser = props => (
  <Modal open={props.isOpen} showCloseIcon={false} onClose={() => {}} center>
    {!props.isLoading ? (
      <React.Fragment>
        <p>Are you sure you want to delete this user?</p>
        <p>
          <PrimaryButton
            text="Cancel"
            onClick={e => {
              e.preventDefault();
              props.onCancel();
            }}
          />
          &nbsp;
          <PrimaryButton
            text="OK"
            onClick={e => {
              e.preventDefault();
              props.onConfirm();
            }}
          />
        </p>
      </React.Fragment>
    ) : (
      <Loader />
    )}
  </Modal>
);

DeleteUser.propTypes = {
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  isOpen: PropTypes.bool,
  isLoading: PropTypes.bool
};

export default DeleteUser;
