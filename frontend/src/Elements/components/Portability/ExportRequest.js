import React from 'react';
import PropTypes from 'prop-types';
import FileSaver from 'file-saver';

class ExportRequest extends React.PureComponent {
  state = {
    processing: false,
    success: false,
    error: null
  };

  async eraseData() {
    this.setState({ processing: true });
    try {
      const data = await this.props.cg.Subject.accessData();
      const blob = new Blob([JSON.stringify(data)], { type: 'text/plain;charset=utf-8' });
      FileSaver.saveAs(blob, 'personal_data.json');
      this.setState({
        success: true,
        processing: false,
        err: null
      });
    } catch (e) {
      this.setState({
        success: false,
        processing: false,
        error: e.toString()
      });
    }
  }

  render() {
    const { processing } = this.state;

    return (
      <button className="button is-primary" onClick={() => this.eraseData()} disabled={processing}>
        {!processing ? (
          <React.Fragment>{this.props.options.label}</React.Fragment>
        ) : (
          <React.Fragment>Downloading...</React.Fragment>
        )}
      </button>
    );
  }
}

ExportRequest.propTypes = {
  options: PropTypes.object,
  cg: PropTypes.object
};

export default ExportRequest;
