import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-responsive-modal';

import styles from 'theme/Views/Modal.scss';

class ModalView extends React.PureComponent {
  render() {
    return (
      <Modal {...this.props} classNames={{ ...styles }}>
        {this.props.children}
        <img
          alt="ClearGDPR"
          src="/logox500.png"
          style={{
            height: '25px',
            position: 'absolute',
            margin: '0 auto',
            left: 0,
            right: 0,
            bottom: '40px'
          }}
        />
      </Modal>
    );
  }
}

ModalView.propTypes = {
  children: PropTypes.node.isRequired
};

export default ModalView;
