import React from 'react';
import { mount, shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import * as ProcessorsDataFactory from 'tests/data/processors.factory';

import session from 'helpers/Session';
import { ProcessorsContainer } from './Processors';

jest.mock('helpers/Session');

beforeEach(() => {
  session.getToken.mockReturnValue('token');
});

const setup = propOverrides => {
  const props = Object.assign({ 
    processors,
    fetchProcessors: () => {},
    isLoading: false 
  }, propOverrides);

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
    expect(toJson(component)).toMatchSnapshot();
  });

  it('should fetch processors after mounting the component', async () => {
    const { mounted } = setup({ fetchProcessors: jest.fn() });
    expect(mounted.props().fetchProcessors).toHaveBeenCalled();
  });
});
