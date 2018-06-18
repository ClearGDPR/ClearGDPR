import React from 'react';
import { shallow } from 'enzyme';
import Users from './Users';

const props = {
  users: [
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
  ]
};

describe('(Component) Users', () => {
  it('should render correctly', () => {
    const component = shallow(<Users {...props} />);
    expect(component).toMatchSnapshot();
  });
});
