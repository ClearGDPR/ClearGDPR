import React, { Component, createContext } from 'react';
import config from 'config';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import internalFetch from 'helpers/internal-fetch';
import { PropTypes } from 'victory';

const StatsContext = createContext({
  isLoading: false,
  stats: {},
  fetchStats: () => {}
});

export class StatsProvider extends Component {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.object,
      PropTypes.arrayOf(PropTypes.element)
    ])
  };

  state = {
    isLoading: false,
    stats: {},
    fetchStats: this.fetchStats
  };

  request = null;

  setLoading = () => {
    this.setState({ loading: true });
  };

  fetchStats = () => {
    // prevents doubling up on requests that are in flight
    if (this.state.isLoading) return this.request;
    this.request = internalFetch(`${config.API_URL}/api/management/stats`)
      .then(({ data: { controller } }) => {
        this.setState({ loading: false, data: controller });
      })
      .catch(err => {
        toast.error(err.message);
        this.setState({ loading: false });
      });
    return this.request;
  };

  render() {
    return <StatsContext.Provider value={this.state}>{this.props.children}</StatsContext.Provider>;
  }
}
