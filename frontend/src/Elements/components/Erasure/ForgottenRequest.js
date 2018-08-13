import React from 'react';
import PropTypes from 'prop-types';

import ModalView from '../Common/Views/Modal';
import styles from '../../theme/ForgottenRequest.scss';
import Subject from '../../contexts/Subject';

const about = `The data subject shall have the right to request from the controller the erasure of
personal data concerning him or her without undue delay and the controller shall have
the obligation to erase personal data without undue delay where one of the following
grounds applies:`;

class ForgottenRequest extends React.PureComponent {
  state = {
    openModal: false,
    processing: false,
    error: null
  };

  async eraseData() {
    this.setState({ processing: true });
    try {
      await this.props.subject.eraseData();
    } catch (e) {
      this.setState({
        processing: false,
        error: e
      });
    }
  }

  onOpenModal = () => {
    this.setState({
      openModal: true
    });
  };

  onCloseModal = () => {
    this.setState({
      openModal: false
    });
  };

  render() {
    const { processing, error } = this.state;

    const Errors = ({ errors }) => {
      return errors ? <div className={styles.error}>{errors.error}</div> : null;
    };

    return (
      <React.Fragment>
        <button className="button is-primary" onClick={this.onOpenModal}>
          {this.props.options.label}
        </button>
        <ModalView open={this.state.openModal} onClose={this.onCloseModal}>
          <div className={styles.container}>
            <div className={styles.full}>
              <h2 className={styles.heading}>Erase Data</h2>
              <h3 className={styles.subheading}>You're about to erase your data</h3>
              <p className={styles.text}>{about}</p>
              <button
                className={`button is-primary ${processing ? 'is-loading' : ''}`}
                onClick={this.eraseData.bind(this)}
              >
                Send Request
              </button>
              <Errors errors={error} />
            </div>
          </div>
        </ModalView>
      </React.Fragment>
    );
  }
}

ForgottenRequest.propTypes = {
  options: PropTypes.object,
  subject: PropTypes.instanceOf(Subject)
};

export default ForgottenRequest;
