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
    const props = Object.assign({}, propOverrides);
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

  it('should throw error when registering new user returned HTTP 400', async () => {
    global.fetch = jest.fn().mockImplementationOnce(() =>
      Promise.resolve({
        status: 400,
        json: () => ({ error: 'Error message' })
      })
    );

    const { component } = setupShallow();

    await expect(
      component.instance().registerUser('bobby', 'somePassword123')
    ).rejects.toMatchSnapshot();
    expect(component.state()).toEqual(
      expect.objectContaining({
        isLoading: false
      })
    );
  });

  it('should throw error when registering new user returned HTTP 500', async () => {
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        status: 500
      })
    );

    const { component } = setupShallow();

    await expect(
      component.instance().registerUser('bobby', 'somePassword123')
    ).rejects.toMatchSnapshot();
    expect(component.state()).toEqual(
      expect.objectContaining({
        isLoading: false
      })
    );
  });

  it('should have correct state after registering a new user', async () => {
    let i = 0;
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        status: 201,
        json: () => {
          const result =
            i === 0 ? { id: 5, username: 'bobby' } : [...users, { id: 5, username: 'bobby' }];
          i++;
          return result;
        }
      })
    );

    const { component } = setupShallow();
    const bobby = await component.instance().registerUser('bobby', 'somePassword123');

    await TestUtils.flushPromises();

    expect(component.state()).toEqual(
      expect.objectContaining({
        users: expect.arrayContaining([...users, bobby]),
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
