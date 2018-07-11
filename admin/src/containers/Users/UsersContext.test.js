import React from 'react';
import { shallow } from 'enzyme';
import { toast } from 'react-toastify';

import * as TestUtils from 'tests/helpers/TestUtils';
import * as UsersDataFactory from 'tests/data/users.factory';
import session from 'helpers/Session';
import { UsersProvider } from './UsersContext';

jest.mock('helpers/Session');

beforeEach(() => {
  session.getToken.mockReturnValue('token');
});

describe('UsersProvider', () => {
  // To prevent showing to console on tests, should be expected by methods using
  // internal-fetch and having error 500.
  global.console = { error: jest.fn()};

  const users = UsersDataFactory.getAll();

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
    expect(console.error).toBeCalled();
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

  it('should throw error when deleting a user returned HTTP 404', async () => {
    global.fetch = jest.fn().mockImplementationOnce(() =>
      Promise.resolve({
        status: 404,
        json: () => ({ error: 'Error message' })
      })
    );

    const { component } = setupShallow();

    await expect(component.instance().deleteUser(4)).rejects.toMatchSnapshot();
    expect(component.state()).toEqual(
      expect.objectContaining({
        isLoading: false
      })
    );
  });

  it('Should toast.error when the API gives a bad response', async () => {
    global.fetch = jest.fn().mockImplementationOnce(() =>
      Promise.resolve({
        status: 404,
        json: () => ({ error: 'Error message' })
      })
    );

    toast.error = jest.fn();

    const { component } = setupShallow();

    try {
      await component.instance().deleteUser(4);
    } catch (e) {
      //not-empty
    }

    expect(toast.error).toHaveBeenCalledWith('An error occurred: Error message');
  });

  it('should throw error when deleting a user returned HTTP 500', async () => {
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        status: 500
      })
    );

    const { component } = setupShallow();

    await expect(component.instance().deleteUser(4)).rejects.toMatchSnapshot();
    expect(component.state()).toEqual(
      expect.objectContaining({
        isLoading: false
      })
    );
    expect(console.error).toBeCalled();
  });

  it('should have correct state after removing user', async () => {
    const filteredUsers = users.filter(u => u.id !== 4);
    let i = 0;
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        status: 200,
        json: () => {
          const result = i === 0 ? { success: true } : filteredUsers;
          i++;
          return result;
        }
      })
    );

    const { component } = setupShallow();
    await component.instance().deleteUser(4);

    await TestUtils.flushPromises();

    expect(component.state()).toEqual(
      expect.objectContaining({
        users: filteredUsers,
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
