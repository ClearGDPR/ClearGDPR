import React from 'react';
import PropTypes from 'prop-types';
import Switch from '../Common/Switch';

class Objection extends React.PureComponent {
  state = {
    allowDataProcessing: true,
    busy: true
  };
  async componentDidMount() {
    const { objection } = await this.props.cg.Subject.getObjectionStatus();
    this.setState({ busy: false, allowDataProcessing: !objection });
  }
  toggleDataProcessingAgreement = async () => {
    const { busy, allowDataProcessing } = this.state;
    if (busy) {
      return;
    }

    this.setState({ allowDataProcessing: !allowDataProcessing, busy: true });
    await this.props.cg.Subject.updateObjection(allowDataProcessing);
    this.setState({ busy: false });
  };
  render() {
    const { label = 'Object data processing' } = this.props.options;
    const { allowDataProcessing, busy } = this.state;

    return (
      <div style={{ alignItems: 'center', display: 'flex' }}>
        <label>{label}</label>&nbsp;
        <Switch
          onChange={this.toggleDataProcessingAgreement}
          value={allowDataProcessing}
          disabled={busy}
        />
      </div>
    );
  }
}

Objection.propTypes = {
  options: PropTypes.object,
  cg: PropTypes.object
};

export default Objection;
