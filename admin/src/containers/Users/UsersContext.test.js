import React from 'react';

import { shallow } from 'enzyme';

import { UsersProvider } from './UsersContext';
import session from '../../helpers/Session';
import TestUtils from '../../helpers/TestUtils';

jest.mock('../../helpers/Session');

beforeEach(() => {
  session.getToken.mockReturnValue('token');
});

describe('UsersProvider', () => {
  let users = [
    {
      id: 1,
      username: 'admin'
    },
    {
      id: 2,
      username: 'joe'
    },
    {
      id: 3,
      username: 'marc'
    },
    {
      id: 4,
      username: 'gina'
    }
  ];

  const setupShallow = propOverrides => {
    const props = Object.assign({ users }, propOverrides);
    const component = shallow(<UsersProvider {...props} />);

    return { props, component };
  };

  it('should have correct state after fetching users', async () => {
    global.fetch = jest.fn().mockImplementationOnce(() =>
      Promise.resolve({
        status: 200,
        json: () => {
          return users;
        }
      })
    );

    const { component } = setupShallow();
    component.instance().fetchUsers();

    await TestUtils.flushPromises();

    expect(component.state()).toEqual(
      expect.objectContaining({
        users: users,
        isLoading: false
      })
    );
  });

  it('should render correctly', async () => {
    global.fetch = jest.fn().mockImplementationOnce(() =>
      Promise.resolve({
        status: 200,
        json: () => {
          return users;
        }
      })
    );

    const { component } = setupShallow();

    await TestUtils.flushPromises();
    expect(component).toMatchSnapshot();
  });
});
