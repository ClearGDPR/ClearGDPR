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
  approveRectification: () => {},
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

  fetchPendingRectifications = async (page = 1) => {
    await this._fetchRectifications(true, false, page);
  };

  fetchProcessedRectifications = async (page = 1) => {
    await this._fetchRectifications(false, true, page);
  };

  fetchAllRectifications = async () => {
    await this._fetchRectifications();
  };

  approveRectification = async id => {
    try {
      await internalFetch(
        `${config.API_URL}/api/management/subjects/rectification-requests/${id}/update-status`,
        {
          method: 'POST',
          body: JSON.stringify({
            status: 'APPROVED'
          })
        }
      );
      toast.success('Rectification request approved');
    } catch (e) {
      return;
    }

    await this.fetchAllRectifications();
  };

  state = {
    pendingRectifications: { paging: { current: 1 } },
    processedRectifications: { paging: { current: 1 } },
    fetchPendingRectifications: this.fetchPendingRectifications,
    fetchProcessedRectifications: this.fetchProcessedRectifications,
    fetchAllRectifications: this.fetchAllRectifications,
    approveRectification: this.approveRectification,
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
    const mappedData = result.data.map(v => {
      let mapped = {
        id: v.id,
        created_at: format(new Date(v.created_at), 'DD/MM/YYYY h:mma'),
        request_reason: v.request_reason
      };

      if (v.status) mapped.status = v.status;
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

  async cancelLoading() {
    this.setLoading(false);
  }

  async _fetchRectifications(pending = true, processed = true, page) {
    this.setLoading(true);

    try {
      const pendingPage = page || this.state.pendingRectifications.paging.current;
      const pendingRectifications = pending
        ? await this._getPendingRectifications(pendingPage)
        : this.state.pendingRectifications;
      const processedRectifications = processed
        ? await this._getProcessedRectifications(
            page || this.state.processedRectifications.paging.current
          )
        : this.state.processedRectifications;
      this.setState({
        pendingRectifications,
        processedRectifications,
        isLoading: false
      });
    } catch (e) {
      await this.cancelLoading();
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
