import React, { Component, createContext } from 'react';
import internalFetch from 'helpers/internal-fetch';
import PropTypes from 'prop-types';
import AppConfig from 'config';

const AttributesConfigContext = createContext({
  fetchConfig: () => {},
  updateConfig: () => {},
  config: null,
  isBusy: false
});

export class AttributesConfigProvider extends Component {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.object,
      PropTypes.arrayOf(PropTypes.element)
    ])
  };

  fetchConfig = async () => {
    const { busy, config } = this.state;
    if (busy || config) {
      return;
    }
    this.setState({ isBusy: true });
    const response = await internalFetch(
      `${AppConfig.API_URL}/api/management/data/attributes-config`
    );
    this.setState({ config: response, isBusy: false });
  };

  updateConfig = async config => {
    this.setState({ isBusy: true });
    await internalFetch(`${AppConfig.API_URL}/api/management/data/attributes-config`, {
      method: 'PUT',
      body: JSON.stringify(config)
    });
    this.setState({ isBusy: false, config });
  };

  state = {
    fetchConfig: this.fetchConfig,
    updateConfig: this.updateConfig,
    config: null,
    isBusy: false
  };

  render() {
    return (
      <AttributesConfigContext.Provider value={this.state}>
        {this.props.children}
      </AttributesConfigContext.Provider>
    );
  }
}

export const AttributesConfigConsumer = AttributesConfigContext.Consumer;
