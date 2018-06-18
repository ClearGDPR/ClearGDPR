import React from 'react';

import { shallow, mount } from 'enzyme';

import UsersContainer from './Users';
import session from '../../helpers/Session';

jest.mock('../../helpers/Session');

beforeEach(() => {
  session.getToken.mockReturnValue('token');
});

describe('(Component) Users', () => {
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

  it('should have correct state after mounting', done => {
    global.fetch = jest.fn().mockImplementationOnce(() =>
      Promise.resolve({
        status: 200,
        json: () => {
          return users;
        }
      })
    );

    const component = mount(<UsersContainer />);
    setTimeout(() => {
      expect(component.state()).toEqual(
        expect.objectContaining({
          users: users
        })
      );
      done();
    }, 100);
  });

  it('should render correctly', done => {
    global.fetch = jest.fn().mockImplementationOnce(() =>
      Promise.resolve({
        status: 200,
        json: () => {
          return users;
        }
      })
    );

    const component = shallow(<UsersContainer />);
    setTimeout(() => {
      expect(component).toMatchSnapshot();
      done();
    }, 100);
  });
});
