import React from 'react';
import ConsentDial from 'components/Dashboard/Widgets/ConsentDial';
import internalFetch from 'helpers/internal-fetch';
import config from 'config';

export class ConsentDialContainer extends React.Component {
  state = {
    isLoading: false,
    data: {}
  };
  componentDidMount() {
    internalFetch(`${config.API_URL}/api/management/stats`)
      .then(({ data: { controller } }) => {
        this.setState({ loading: false, data: controller });
      })
      .catch(() => {
        this.setState({ loading: false });
      });
  }

  render() {
    return (
      <ConsentDial
        consented={this.state.data.consented}
        unconsented={this.state.data.unconsented}
      />
    );
  }
}

export default ConsentDialContainer;
