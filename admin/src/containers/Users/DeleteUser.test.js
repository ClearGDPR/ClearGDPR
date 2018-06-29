import React from 'react';
import { shallow } from 'enzyme';

import session from 'helpers/Session';
import * as TestUtils from 'tests/helpers/TestUtils';

import { DeleteUserContainer as DeleteUser } from './DeleteUser';

jest.mock('helpers/Session');

const setupShallow = propOverrides => {
  const props = Object.assign(
    {
      userId: 1,
      deleteUser: jest.fn().mockReturnValue(Promise.resolve()),
      onClose: jest.fn(),
      isOpen: true,
      isLoading: false
    },
    propOverrides
  );
  const component = shallow(<DeleteUser {...props} />);

  return { props, component };
};

beforeEach(() => {
  session.getToken.mockReturnValue('token');
});

describe('(Container) Delete user', () => {
  it('should render correctly when user id and default provided props provided', async () => {
    const { component } = setupShallow();
    expect(component).toMatchSnapshot();
  });

  it('should call delete user from props when delete user was called', async () => {
    const { props, component } = setupShallow();
    component.instance().deleteUser();
    expect(props.deleteUser).toHaveBeenCalledWith(1);
  });

  it('should call onClose when deleting user is successful', async () => {
    const { props, component } = setupShallow();
    component.instance().deleteUser();
    await TestUtils.flushPromises();
    expect(props.onClose).toHaveBeenCalled();
  });
});
