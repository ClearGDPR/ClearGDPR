import React, { Component, createContext } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';

import config from 'config';
import internalFetch from 'helpers/internal-fetch';

const ProcessorsContext = createContext({
  processors: [],
  fetchProcessors: () => {},
  registerProcessors: () => {},
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
    isLoading: false
  };

  _getProcessors() {
    return internalFetch(`${config.API_URL}/api/management/processors/list`);
  }

  _createProcessors(processor) {
    return internalFetch(`${config.API_URL}/api/management/processors/add`, {
      method: 'POST',
      body: JSON.stringify(processor)
    });
  }

  _updateProcessors(processor) {
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

    const newProcessor = await this._createProcessro(processor).catch(
      this.cancelLoadingAndReject.bind(this)
    );
    toast.success('Processor successfully added.');
    await this.fetchProcessors();

    return newProcessor;
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
