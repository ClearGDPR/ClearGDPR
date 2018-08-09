import React from 'react';
import PropTypes from 'prop-types';
import JSONInput from 'react-json-editor-ajrm/index';
import locale from 'react-json-editor-ajrm/locale/en';
import styles from '../../theme/ForgottenRequest.scss';

class RectificationForm extends React.Component {
  constructor(props) {
    super();
    this.state = {
      resultData: { ...props.data },
      reason: ''
    };
  }
  _updateResultData = ({ jsObject }) => this.setState({ resultData: jsObject });
  _updateReason = e => this.setState({ reason: e.target.value });
  _onFormSubmit = e => {
    e.preventDefault();
    const { reason, resultData } = this.state;
    this.props.onSubmit(reason, resultData);
  };
  render() {
    const { resultData, reason } = this.state;
    const { processingRequest, error, label } = this.props;
    return (
      <form onSubmit={this._onFormSubmit}>
        <JSONInput
          id="a_unique_id"
          placeholder={resultData}
          locale={locale}
          viewOnly={processingRequest}
          onChange={this._updateResultData}
          theme="light_mitsuketa_tribute"
          height="350px"
        />
        <div className="field">
          <label className="label">Reason</label>
          <div className="control">
            <input
              className="input"
              type="text"
              required="true"
              value={reason}
              onChange={this._updateReason}
            />
          </div>
        </div>
        {error && <div className={styles.error}>{error}</div>}
        <button className={`button is-primary`}>
          {processingRequest ? 'Processing...' : label}
        </button>
      </form>
    );
  }
}

RectificationForm.propTypes = {
  data: PropTypes.object,
  label: PropTypes.string,
  error: PropTypes.string,
  onSubmit: PropTypes.func,
  processingRequest: PropTypes.bool
};

export default RectificationForm;
