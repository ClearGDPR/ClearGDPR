import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { createMemoryHistory } from 'history';
import { flushPromises } from '../../tests/helpers/TestUtils';
import { LoginContainer } from './Login';

import session from '../../helpers/Session';

jest.mock('../../helpers/Session');

beforeEach(() => {
  jest.resetAllMocks();
});

const setup = propOverrides => {
  const props = Object.assign({}, propOverrides);
  const history = createMemoryHistory('/');
  const component = shallow(
    <LoginContainer location={{ from: { path: '/' } }} history={history} />
  );

  return { props, component };
};

describe('(Container) Login', () => {
  it('should render correctly', () => {
    const { component } = setup();
    expect(toJson(component)).toMatchSnapshot();
  });

  it('should send username and password and receive a token', async () => {
    global.fetch = jest.fn().mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => ({
          jwt: 'token'
        })
      })
    );

    const { component } = setup();
    const instance = component.instance();
    const response = await instance.handleLogin('username', 'password');

    await flushPromises();
    expect(global.fetch).toBeCalled();
    expect(response.status).toBe(200);
    expect(response.json()).toEqual({
      jwt: 'token'
    });
    expect(session.set).toHaveBeenLastCalledWith({
      jwt: 'token',
      username: 'username'
    });
  });

  it('should send bad username or password and fail', async () => {
    global.fetch = jest.fn().mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        status: 400,
        json: () => {
          return Promise.resolve({ error: 'Invalid credentials' });
        }
      })
    );

    const { component } = setup();
    const instance = component.instance();

    expect(instance.handleLogin(null, null)).rejects.toMatchObject({
      message: 'Invalid credentials'
    });

    await flushPromises();
    expect(global.fetch).toBeCalled();
  });
});
