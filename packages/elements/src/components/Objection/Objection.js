import React from 'react';
import PropTypes from 'prop-types';
import Switch from 'components/Common/Switch';
import Subject from 'contexts/Subject';

class Objection extends React.PureComponent {
  state = {
    allowDataProcessing: true,
    busy: false
  };
  componentDidMount() {
    this.props.subject.fetchObjectionStatus();
  }
  toggleDataProcessingAgreement = async () => {
    const { busy } = this.state;
    const { objection } = this.props.subject;
    if (busy) {
      return;
    }

    this.setState({ busy: true });
    await this.props.subject.updateObjection(!objection);
    this.setState({ busy: false });
  };
  render() {
    const { label = 'Object data processing' } = this.props.options;
    const { busy } = this.state;
    const { objection } = this.props.subject;

    return (
      <div style={{ alignItems: 'center', display: 'flex' }}>
        <label>{label}</label>
        &nbsp;
        <Switch
          onChange={this.toggleDataProcessingAgreement}
          value={!objection}
          disabled={busy || objection === null}
        />
      </div>
    );
  }
}

Objection.propTypes = {
  options: PropTypes.object,
  subject: PropTypes.instanceOf(Subject)
};

export default Objection;
