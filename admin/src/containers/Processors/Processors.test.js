import React from 'react';

import { shallow, mount } from 'enzyme';
import * as ProcessorsDataFactory from '../../tests/data/processors.factory';
import { flushPromises } from '../../tests/helpers/TestUtils';

import { ProcessorsContainer } from './Processors';
import session from '../../helpers/Session';

jest.mock('../../helpers/Session');

beforeEach(() => {
  session.getToken.mockReturnValue('token');
});

describe('(Container) Processors', () => {
  const processors = ProcessorsDataFactory.getAll();

  it('should have correct state after mounting', async () => {
    global.fetch = jest.fn().mockImplementationOnce(() =>
      Promise.resolve({
        status: 200,
        json: () => processors
      })
    );

    const component = mount(<ProcessorsContainer />);
    await flushPromises();

    expect(component.state()).toEqual(
      expect.objectContaining({
        processors: processors
      })
    );
  });

  it('should render correctly', async () => {
    global.fetch = jest.fn().mockImplementationOnce(() =>
      Promise.resolve({
        status: 200,
        json: () => processors
      })
    );

    const component = shallow(<ProcessorsContainer />);

    await flushPromises();
    expect(component).toMatchSnapshot();
  });
});
