import React, { Component, createContext } from 'react';
import PropTypes from 'prop-types';
import config from 'config';
import internalFetch from 'helpers/internal-fetch';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

const RectificationsContext = createContext({
  pendingRectifications: {},
  processedRectifications: {},
  fetchPendingRectifications: () => {},
  fetchProcessedRectifications: () => {},
  fetchAllRectifications: () => {},
  isLoading: false
});

export class RectificationsProvider extends Component {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.object,
      PropTypes.arrayOf(PropTypes.element)
    ])
  };

  state = {
    pendingRectifications: {},
    processedRectifications: {},
    fetchPendingRectifications: this.fetchPendingRectifications.bind(this),
    fetchProcessedRectifications: this.fetchProcessedRectifications.bind(this),
    fetchAllRectifications: this.fetchAllRectifications.bind(this),
    isLoading: false
  };

  async _getPendingRectifications(page = 1) {
    return this._mapRectificationResults(
      await internalFetch(
        `${config.API_URL}/api/management/subjects/rectification-requests/list?page=${page}`
      )
    );
  }

  async _getProcessedRectifications(page = 1) {
    return this._mapRectificationResults(
      await internalFetch(
        `${config.API_URL}/api/management/subjects/rectification-requests/archive?page=${page}`
      )
    );
  }

  _mapRectificationResults(result) {
    let mappedData = result.data.map(v => {
      let mapped = {
        id: v.id,
        created_at: format(new Date(v.created_at), 'DD/MM/YYYY h:mma'),
        request_reason: v.request_reason
      };

      v.status && (mapped.status = v.status);
      return mapped;
    });
    return {
      ...result,
      data: mappedData
    };
  }

  setLoading(loading) {
    this.setState({
      isLoading: loading
    });
  }

  async cancelLoadingAndReject(e) {
    this.setLoading(false);
    toast.error(`An error occurred: ${e.message}`);
  }

  async fetchPendingRectifications(page = 1) {
    await this._fetchRectifications(false, page);
  }

  async fetchProcessedRectifications(page = 1) {
    await this._fetchRectifications(true, page);
  }

  async fetchAllRectifications(page = 1) {
    await this._fetchRectifications(null, page);
  }

  async _fetchRectifications(archive = null, page = 1) {
    this.setLoading(true);

    try {
      const pendingRectifications =
        archive === null || !archive
          ? await this._getPendingRectifications(page)
          : this.state.pendingRectifications;
      const processedRectifications =
        archive === null || archive
          ? await this._getProcessedRectifications(page)
          : this.state.processedRectifications;
      this.setState({
        pendingRectifications,
        processedRectifications,
        isLoading: false
      });
    } catch (e) {
      await this.cancelLoadingAndReject(e);
    }
  }

  render() {
    return (
      <RectificationsContext.Provider value={this.state}>
        {this.props.children}
      </RectificationsContext.Provider>
    );
  }
}

export const RectificationsConsumer = RectificationsContext.Consumer;
