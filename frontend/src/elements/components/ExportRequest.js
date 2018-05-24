import React from 'react';
import FileSaver from 'file-saver';

class ExportRequest extends React.PureComponent {
  state = {
    processing: false,
    success: false,
    error: null
  };

  eraseData() {
    this.setState({ processing: true });
    setTimeout(() => {
      const cgToken = localStorage.getItem('cgToken');
      window.cg.setAccessToken(cgToken);
      window.cg.Subject.accessData()
        .then(data => {
          const blob = new Blob([JSON.stringify(data)], { type: 'text/plain;charset=utf-8' });
          FileSaver.saveAs(blob, 'personal_data.json');
          this.setState({
            success: true,
            processing: false,
            err: null
          });
        })
        .catch(err => {
          this.setState({
            success: false,
            processing: false,
            error: err
          });
        });
    }, 1000);
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

export default ExportRequest;
