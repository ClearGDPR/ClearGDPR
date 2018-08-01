import React from 'react';
import { shallow } from 'enzyme';

import * as TestUtils from 'tests/helpers/TestUtils';

import { AddProcessorContainer } from './AddProcessor';

const setupShallow = propOverrides => {
  const props = Object.assign(
    {
      addProcessor: jest.fn().mockReturnValue(Promise.resolve()),
      closePanel: jest.fn(),
      isLoading: false
    },
    propOverrides
  );
  const component = shallow(<AddProcessorContainer {...props} />);

  return { props, component };
};

describe('(Container) Add Processor', () => {
  it('should render correctly when default props provided', async () => {
    const { component } = setupShallow();
    expect(component).toMatchSnapshot();
  });

  it('should populate errors on submit when create rejects with error', async () => {
    const { props, component } = setupShallow();
    const stubProcessor = {
      name: null,
      logoUrl: null,
      scopes: []
    };

    props.addProcessor.mockReturnValue(Promise.reject(new Error('Test error')));
    component.instance().onSubmit(stubProcessor);

    await TestUtils.flushPromises();
    expect(component.state()).toMatchSnapshot();
  });

  it('should close panel when create succeeded', async () => {
    const { props, component } = setupShallow();
    const stubProcessor = {
      name: 'Processor Name',
      logoUrl: 'https://a_valid_url.com/file.png',
      scopes: []
    };

    component.instance().onSubmit(stubProcessor);

    await TestUtils.flushPromises();
    expect(props.closePanel).toHaveBeenCalled();
  });

  it('should be able to add processor without scopes', () => {
    const { component } = setupShallow();
    const stubProcessor = {
      name: 'Processor Name',
      logoUrl: 'https://a_valid_url.com/file.png'
    };
    try {
      component.instance().onSubmit(stubProcessor);
    } catch (e) {
      expect(true).toBe(false);
    }
  });
});
