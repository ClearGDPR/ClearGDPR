import React, { Component, createContext } from 'react';
import PropTypes from 'prop-types';
import config from 'config';
import internalFetch from 'helpers/internal-fetch';
import { toast } from 'react-toastify';

const RectificationsContext = createContext({
  pendingRectifications: {},
  processedRectifications: {},
  fetchPendingRectifications: () => {},
  fetchProcessedRectifications: () => {},
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
    isLoading: false
  };

  async _getPendingRectifications(page = 1) {
    return await internalFetch(
      `${config.API_URL}/api/management/subjects/rectification-requests/list?page=${page}`
    );
  }

  async _getProcessedRectifications(page = 1) {
    return await internalFetch(
      `${config.API_URL}/api/management/subjects/rectification-requests/archive?page=${page}`
    );
  }

  setLoading(loading) {
    this.setState({
      isLoading: loading
    });
  }

  async cancelLoadingAndReject(e) {
    this.setLoading(false);
    toast.error(`An error occurred: ${e.message}`);
    throw e;
  }

  async fetchPendingRectifications(page = 1) {
    await this._fetchRectifications(false, page);
  }

  async fetchProcessedRectifications(page = 1) {
    await this._fetchRectifications(true, page);
  }

  async _fetchRectifications(archive = false, page = 1) {
    this.setLoading(true);

    try {
      if (!archive) {
        const rectifications = !archive
          ? await this._getPendingRectifications(page)
          : await this._getProcessedRectifications(page);
        this.setState({
          pendingRectifications: rectifications,
          isLoading: false
        });
      } else {
        const rectifications = !archive
          ? await this._getPendingRectifications(page)
          : await this._getProcessedRectifications(page);
        this.setState({
          processedRectifications: rectifications,
          isLoading: false
        });
      }
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
