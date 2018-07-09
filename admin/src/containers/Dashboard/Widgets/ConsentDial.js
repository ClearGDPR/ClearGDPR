import React from 'react';
import ConsentDial from 'components/Dashboard/Widgets/ConsentDial';
import internalFetch from 'helpers/internal-fetch';
import config from 'config';
import { toast } from 'react-toastify';

export class ConsentDialContainer extends React.Component {
  state = {
    isLoading: false,
    data: {}
  };
  componentDidMount() {
    internalFetch(`${config.API_URL}/api/management/stats`)
      .then(({ data }) => {
        this.setState({ data, loading: false });
      })
      .catch(err => {
        toast.error(err.message);
        this.setState({ loading: false });
      });
  }
  render() {
    return <ConsentDial data={this.state.data.consented || 1} />;
  }
}

export default ConsentDialContainer;
