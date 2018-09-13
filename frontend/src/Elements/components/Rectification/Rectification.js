import React from 'react';
import PropTypes from 'prop-types';
import RectificationForm from './RectificationForm';
import ModalView from 'components/Common/Views/Modal';
import styles from 'theme/ForgottenRequest.scss';

const Loading = () => (
  <div style={{ textAlign: 'center' }}>
    <i className="fas fa-spinner fa-pulse fa-3x" />
  </div>
);

class Rectification extends React.Component {
  defaultState = {
    active: false,
    processingRequest: false,
    error: null,
    success: false
  };
  state = this.defaultState;
  _startRectification = () => {
    this.props.subject.fetchData();
    this.setState({ ...this.defaultState, active: true });
  };
  _cancelRectification = () => {
    if (!this.state.processingRequest) {
      this.setState({ active: false });
    }
  };
  _sendRectificationRequest = async (reason, rectifiedData) => {
    this.setState({ processingRequest: true });
    try {
      if (this._compareObjects(this.props.subject.data, rectifiedData)) {
        throw new Error('Please do any updates before initiate rectification!');
      }
      await this.props.subject.initiateRectification(reason, rectifiedData);
      this.setState({ success: true });
    } catch (e) {
      this.setState({ error: e.message });
    }
    this.setState({ processingRequest: false });
  };
  //@todo this is very naive comparison algorithm, may need to replace it with something like `deep-equal`
  _compareObjects = (a, b) => {
    return JSON.stringify(a) === JSON.stringify(b);
  };
  render() {
    const { label } = this.props.options;
    const { active, processingRequest, error, success } = this.state;

    const { data, isFetched } = this.props.subject;
    return (
      <React.Fragment>
        <button className="button is-primary" onClick={this._startRectification}>
          {label}
        </button>
        <ModalView open={active} onClose={this._cancelRectification}>
          <div className={styles.container}>
            <div className={styles.full}>
              <h2 className={styles.heading}>{label}</h2>
              {isFetched ? (
                <React.Fragment>
                  {!success && (
                    <RectificationForm
                      {...{
                        onSubmit: this._sendRectificationRequest,
                        data,
                        label,
                        error,
                        processingRequest
                      }}
                    />
                  )}
                  {success && (
                    <div className={styles.success}>
                      <h2 className={styles.title}>Your request has ben sent!</h2>
                      <p className={styles.about}>
                        Please wait, we will review it as soon as possible.
                      </p>
                    </div>
                  )}
                </React.Fragment>
              ) : (
                <Loading />
              )}
            </div>
          </div>
        </ModalView>
      </React.Fragment>
    );
  }
}

Rectification.propTypes = {
  options: PropTypes.object,
  subject: PropTypes.object
};

export default Rectification;
