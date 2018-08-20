import React from 'react';
import { shallow } from 'enzyme';
import internalFetch from 'helpers/internal-fetch';
import AppConfig from 'config';
import { AttributesConfigProvider } from './AttributesConfigContext';

jest.mock('helpers/internal-fetch');

const EXAMPLE_CONFIG = {
  email: {
    type: 'email',
    label: 'Your email address',
    required: true
  }
};

describe('AttributesConfigProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const setupProvider = () =>
    shallow(
      <AttributesConfigProvider>
        <div>test</div>
      </AttributesConfigProvider>
    );

  it('should define initial state', () => {
    const provider = setupProvider();
    const { config, isBusy } = provider.state();
    expect(config).toBe(null);
    expect(isBusy).toBe(false);
  });

  it('should set busy state to true before fetch config', () => {
    const provider = setupProvider();
    provider.state().fetchConfig();
    expect(provider.state().isBusy).toBe(true);
  });

  it('should make API request to fetch config', () => {
    const provider = setupProvider();
    provider.state().fetchConfig();
    expect(internalFetch).toHaveBeenCalledWith(
      `${AppConfig.API_URL}/api/management/data/attributes-config`
    );
  });

  it('should place fetched config into state and set busy to false', async () => {
    internalFetch.mockReturnValue(Promise.resolve(EXAMPLE_CONFIG));
    const provider = setupProvider();
    await provider.state().fetchConfig();
    const { isBusy, config } = provider.state();
    expect(isBusy).toBe(false);
    expect(config).toBe(EXAMPLE_CONFIG);
  });

  it('should set busy state to true before update config', () => {
    const provider = setupProvider();
    provider.state().updateConfig(EXAMPLE_CONFIG);
    expect(provider.state().isBusy).toBe(true);
  });

  it('should make request to API endpoint to update config', () => {
    const provider = setupProvider();
    provider.state().updateConfig(EXAMPLE_CONFIG);
    expect(internalFetch).toHaveBeenCalledWith(
      `${AppConfig.API_URL}/api/management/data/attributes-config/update`,
      {
        body: JSON.stringify(EXAMPLE_CONFIG),
        method: 'POST'
      }
    );
  });

  it('should place updated config into state and set busy to false', async () => {
    const provider = setupProvider();
    await provider.state().updateConfig(EXAMPLE_CONFIG);
    const { config, isBusy } = provider.state();
    expect(isBusy).toBe(false);
    expect(config).toBe(EXAMPLE_CONFIG);
  });
});
