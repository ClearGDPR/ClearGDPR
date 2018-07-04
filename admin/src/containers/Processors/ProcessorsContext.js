import React, { Component, createContext } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';

import config from 'config';
import internalFetch from 'helpers/internal-fetch';

const ProcessorsContext = createContext({
  processors: [],
  fetchProcessors: () => {},
  addProcessor: () => {},
  updateProcessor: () => {},
  deleteProcessor: () => {},
  isLoading: false
});

export class ProcessorsProvider extends Component {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.object,
      PropTypes.arrayOf(PropTypes.element)
    ])
  };

  state = {
    processors: [],
    fetchProcessors: this.fetchProcessors.bind(this),
    addProcessor: this.addProcessor.bind(this),
    updateProcessor: this.updateProcessor.bind(this),
    deleteProcessor: this.deleteProcessor.bind(this),
    isLoading: false
  };

  _getProcessors() {
    return internalFetch(`${config.API_URL}/api/management/processors/list`);
  }

  _addProcessor(processor) {
    return internalFetch(`${config.API_URL}/api/management/processors/add`, {
      method: 'POST',
      body: JSON.stringify(processor)
    });
  }

  _updateProcessor(processor) {
    return internalFetch(`${config.API_URL}/api/management/processors/update`, {
      method: 'POST',
      body: JSON.stringify(processor)
    });
  }

  async _deleteProcessor(processorId) {
    await internalFetch(`${config.API_URL}/api/management/processors/${processorId}/remove`, {
      method: 'POST'
    });
  }

  setLoading(loading) {
    this.setState({
      isLoading: loading
    });
  }

  cancelLoadingAndReject(e) {
    this.setLoading(false);
    toast.error(`An error occurred: ${e.message}`);
    return Promise.reject(e);
  }

  async fetchProcessors() {
    this.setLoading(true);

    const processors = await this._getProcessors();
    this.setState({
      processors,
      isLoading: false
    });
  }

  async addProcessor(processor) {
    this.setLoading(true);

    const newProcessor = await this._addProcessor(processor).catch(
      this.cancelLoadingAndReject.bind(this)
    );
    toast.success('Processor successfully added.');
    await this.fetchProcessors();

    return newProcessor;
  }

  async updateProcessor(processor) {
    this.setLoading(true);

    const updatedProcessor = await this._updateProcessor(processor).catch(
      this.cancelLoadingAndReject.bind(this)
    );
    toast.success('Processor successfully updated.');
    await this.fetchProcessors();

    return updatedProcessor;
  }

  async deleteProcessor(processor) {
    this.setLoading(true);

    const isDeleted = await this._deleteProcessor(processor).catch(
      this.cancelLoadingAndReject.bind(this)
    );
    toast.success('Processor successfully deleted.');
    await this.fetchProcessors();

    return isDeleted;
  }

  render() {
    return (
      <ProcessorsContext.Provider value={this.state}>
        {this.props.children}
      </ProcessorsContext.Provider>
    );
  }
}

export const ProcessorsConsumer = ProcessorsContext.Consumer;
