import React from 'react';
import { shallow } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import toJson from 'enzyme-to-json';
import LoginContainer from './Login';

const flushPromises = () => new Promise(resolve => setImmediate(resolve));

const setup = propOverrides => {
  const props = Object.assign({}, propOverrides);

  const component = shallow(
    <MemoryRouter initialEntries={[{ pathname: '/', key: 'testKey' }]}>
      <LoginContainer location={{ from: { path: '/' } }} />
    </MemoryRouter>
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
        status: 200,
        json: () => true
      })
    );

    // const { component } = setup();
    await flushPromises();
  });

  it('should send bad username or password and fail', async () => {
    global.fetch = jest.fn().mockImplementationOnce(() =>
      Promise.resolve({
        status: 400,
        json: () => false
      })
    );

    // const { component } = setup();
    await flushPromises();
  });
});
