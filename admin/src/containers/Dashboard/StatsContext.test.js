import React from 'react';

import { shallow } from 'enzyme';

import { StatsProvider } from './StatsContext';
import session from 'helpers/Session';
import * as TestUtils from 'tests/helpers/TestUtils';

jest.mock('helpers/Session');

const setupShallow = propOverrides => {
  const props = Object.assign({}, propOverrides);
  const component = shallow(<StatsProvider {...props} />);

  return { props, component };
};

const data = {
  controller: {
    total: 1,
    consented: 1,
    unconsented: 0
  },
  processors: {
    1: {
      consented: 1,
      name: 'test'
    }
  }
};

beforeEach(() => {
  session.getToken.mockReturnValue('token');
});

describe('StatsProvider', () => {
  it('should have correct state after fetching users', async () => {
    global.fetch = jest.fn().mockImplementationOnce(() =>
      Promise.resolve({
        status: 200,
        json: () => {
          return { data };
        }
      })
    );

    const { component } = setupShallow();
    component.instance().fetchStats();

    await TestUtils.flushPromises();

    expect(component.state()).toEqual(
      expect.objectContaining({
        stats: data,
        isLoading: false
      })
    );
  });

  it('should render correctly', async () => {
    global.fetch = jest.fn().mockImplementationOnce(() =>
      Promise.resolve({
        status: 200,
        json: () => {
          return { data };
        }
      })
    );

    const { component } = setupShallow();

    await TestUtils.flushPromises();
    expect(component).toMatchSnapshot();
  });
});
