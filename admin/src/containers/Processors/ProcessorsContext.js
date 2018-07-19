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

  fetchProcessors = async () => {
    this.setLoading(true);

    const processors = await this._getProcessors();
    this.setState({
      processors,
      isLoading: false
    });
  };

  addProcessor = async processor => {
    const newProcessor = await this._addProcessor(processor).catch(
      this.cancelLoadingAndReject.bind(this)
    );
    toast.success('Processor successfully added.');
    await this.fetchProcessors();

    return newProcessor;
  };

  updateProcessor = async processor => {
    const updatedProcessor = await this._updateProcessor(processor).catch(
      this.cancelLoadingAndReject.bind(this)
    );
    toast.success('Processor successfully updated.');
    await this.fetchProcessors();

    return updatedProcessor;
  };

  deleteProcessor = async processor => {
    this.setLoading(true);

    const isDeleted = await this._deleteProcessor(processor).catch(
      this.cancelLoadingAndReject.bind(this)
    );
    toast.success('Processor successfully deleted.');
    await this.fetchProcessors();

    return isDeleted;
  };

  state = {
    processors: [],
    fetchProcessors: this.fetchProcessors,
    addProcessor: this.addProcessor,
    updateProcessor: this.updateProcessor,
    deleteProcessor: this.deleteProcessor,
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
    await internalFetch(`${config.API_URL}/api/management/processors/remove`, {
      method: 'POST',
      body: JSON.stringify({
        processorIds: [processorId]
      })
    });
  }

  setLoading(loading) {
    this.setState({
      isLoading: loading
    });
  }

  cancelLoadingAndReject(e) {
    this.setLoading(false);
    return Promise.reject(e);
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
