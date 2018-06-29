import React from 'react';

import { mount, shallow } from 'enzyme';

import { UsersContainer } from './Users';

jest.mock('helpers/Session');

const users = [
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
  const props = Object.assign({ users, fetchUsers: () => {}, isLoading: false }, propOverrides);
  const component = shallow(<UsersContainer {...props} />);

  return { props, component };
};

const setupMount = propOverrides => {
  const props = Object.assign({ users, fetchUsers: () => {}, isLoading: false }, propOverrides);
  const component = mount(<UsersContainer {...props} />);

  return { props, component };
};

describe('(Container) Users', () => {
  it('should have correct state after mounting', async () => {
    const { component } = setupShallow();

    expect(component.props()).toEqual(
      expect.objectContaining({
        users: users
      })
    );
  });

  it('should render correctly', async () => {
    const { component } = setupShallow();
    expect(component).toMatchSnapshot();
  });

  it('should fetch users after mounting the component', async () => {
    const { component } = setupMount({ fetchUsers: jest.fn() });
    expect(component.props().fetchUsers).toHaveBeenCalled();
  });
});
