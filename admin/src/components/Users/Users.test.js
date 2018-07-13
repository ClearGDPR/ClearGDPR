import React from 'react';
import { shallow } from 'enzyme';
import Users from './Users';
import * as UsersDataFactory from 'tests/data/users.factory';

const setup = propOverrides => {
  const props = Object.assign(
    {
      users: UsersDataFactory.getAll(),
      isLoading: false,
      onChangePasswordClick: jest.fn(),
      onDeleteClick: jest.fn(),
      onRegisterUserClick: jest.fn()
    },
    propOverrides
  );

  const component = shallow(<Users {...props} />);

  return { props, component };
};

describe('(Component) Users', () => {
  it('should render when not loading correctly', () => {
    const { component } = setup();
    expect(component).toMatchSnapshot();
  });

  it('should render when loading correctly', () => {
    const { component } = setup({ isLoading: true });
    expect(component).toMatchSnapshot();
  });
});
