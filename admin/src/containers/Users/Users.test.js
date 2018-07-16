import React from 'react';

import { mount, shallow } from 'enzyme';
import { UsersContainer } from './Users';
import * as UsersDataFactory from 'tests/data/users.factory';
import { flushPromises } from 'tests/helpers/TestUtils';

jest.mock('helpers/Session');

const users = UsersDataFactory.getAll();

const setup = propOverrides => {
  const props = Object.assign(
    { users, fetchUsers: jest.fn().mockReturnValue(Promise.resolve()), isLoading: false },
    propOverrides
  );
  const component = shallow(<UsersContainer {...props} />);
  const mounted = mount(<UsersContainer {...props} />);

  return { props, component, mounted };
};

describe('(Container) Users', () => {
  it('should have correct state after mounting', async () => {
    const { component } = setup();

    expect(component.props()).toEqual(
      expect.objectContaining({
        users: users
      })
    );
  });

  it('should render correctly', async () => {
    const { component } = setup();
    expect(component).toMatchSnapshot();
  });

  it('should fetch users after mounting the component', async () => {
    const { mounted } = setup();
    expect(mounted.props().fetchUsers).toHaveBeenCalled();
  });

  it('should not break when fetchUsers rejects', async () => {
    setup({
      fetchUsers: jest.fn().mockReturnValue(Promise.reject('Serious error message'))
    });
    await flushPromises();
  });
});
