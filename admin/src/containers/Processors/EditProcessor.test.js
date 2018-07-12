import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import * as TestUtils from 'tests/helpers/TestUtils';

import { EditProcessorContainer } from './EditProcessor';

const setupShallow = propOverrides => {
  const props = Object.assign(
    {
      updateProcessor: jest.fn().mockReturnValue(Promise.resolve()),
      closePanel: jest.fn(),
      isLoading: false,
      processor: {}
    },
    propOverrides
  );
  const component = shallow(<EditProcessorContainer {...props} />);

  return { props, component };
};

describe('(Container) Edit Processor', () => {
  it('should render correctly when default props provided', async () => {
    const { component } = setupShallow();
    expect(toJson(component)).toMatchSnapshot();
  });

  it('should populate errors on submit when update rejects with error', async () => {
    const { props, component } = setupShallow();
    const stubProcessor = {
      name: null,
      logoUrl: null,
      scopes: []
    };

    props.updateProcessor.mockReturnValue(Promise.reject(new Error('Test error')));
    component.instance().onSubmit(stubProcessor);

    await TestUtils.flushPromises();
    expect(component.state()).toMatchSnapshot();
  });

  it('should close panel when update succeeded', async () => {
    const { props, component } = setupShallow();
    const stubProcessor = {
      name: 'test.processor',
      logoUrl: 'https://this.is.a.mock.image.com/url.png',
      scopes: []
    };

    component
      .instance()
      .onSubmit(stubProcessor);

    await TestUtils.flushPromises();
    expect(props.closePanel).toHaveBeenCalled();
  });
});
