import React from 'react';
import { mount, shallow } from 'enzyme';

import { flushPromises } from 'tests/helpers/TestUtils';
import * as ProcessorsDataFactory from 'tests/data/processors.factory';

import { ProcessorsContainer } from './Processors';

const setup = propOverrides => {
  const props = Object.assign(
    {
      processors,
      fetchProcessors: jest.fn().mockReturnValue(Promise.resolve()),
      isLoading: false
    },
    propOverrides
  );

  const component = shallow(<ProcessorsContainer {...props} />);
  const mounted = mount(<ProcessorsContainer {...props} />);

  return { props, component, mounted };
};

const processors = ProcessorsDataFactory.getAll();

describe('(Container) Processors', () => {
  it('should have correct state after mounting', async () => {
    const { component } = setup();

    expect(component.props()).toEqual(
      expect.objectContaining({
        processors: processors
      })
    );
  });

  it('should render correctly', async () => {
    const { component } = setup();
    expect(component).toMatchSnapshot();
  });

  it('should fetch processors after mounting the component', async () => {
    const { mounted } = setup();
    expect(mounted.props().fetchProcessors).toHaveBeenCalled();
  });

  it('should not break when fetchProcessors rejects', async () => {
    setup({
      fetchProcessors: jest.fn().mockReturnValue(Promise.reject('Serious error message'))
    });
    await flushPromises();
  });
});
