import React from 'react';

import { shallow, mount } from 'enzyme';

import { UsersContainer } from './Users';
import session from '../../helpers/Session';
import TestUtils from '../../helpers/TestUtils';

jest.mock('../../helpers/Session');

beforeEach(() => {
  session.getToken.mockReturnValue('token');
});

describe('(Container) Users', () => {
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

  it('should have correct state after mounting', async () => {
    global.fetch = jest.fn().mockImplementationOnce(() =>
      Promise.resolve({
        status: 200,
        json: () => {
          return users;
        }
      })
    );

    const component = mount(<UsersContainer />);
    await TestUtils.flushPromises();

    expect(component.state()).toEqual(
      expect.objectContaining({
        users: users
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

    const component = shallow(<UsersContainer />);

    await TestUtils.flushPromises();
    expect(component).toMatchSnapshot();
  });
});
