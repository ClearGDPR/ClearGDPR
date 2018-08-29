import React from 'react';
import PropTypes from 'prop-types';
import FileSaver from 'file-saver';
import Subject from 'contexts/Subject';

class ExportRequest extends React.PureComponent {
  state = {
    processing: false,
    success: false
  };

  loadData() {
    this.props.subject.fetchData();
    this.setState({ processing: true });
    const intervalId = setInterval(() => {
      const { data } = this.props.subject;
      if (!data) {
        return;
      }

      clearInterval(intervalId);

      const blob = new Blob([JSON.stringify(data)], { type: 'text/plain;charset=utf-8' });
      FileSaver.saveAs(blob, 'personal_data.json');
      this.setState({
        success: true,
        processing: false
      });
    }, 500);
  }

  render() {
    const { processing } = this.state;

    return (
      <button className="button is-primary" onClick={() => this.loadData()} disabled={processing}>
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
  subject: PropTypes.instanceOf(Subject)
};

export default ExportRequest;
