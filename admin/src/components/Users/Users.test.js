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
  ],
  isLoading: false
};

describe('(Component) Users', () => {
  it('should render when not loading correctly', () => {
    const component = shallow(<Users {...props} />);
    expect(component).toMatchSnapshot();
  });

  it('should render when loading correctly', () => {
    let propsClone = { ...props };
    propsClone.isLoading = true;
    const component = shallow(<Users {...propsClone} />);
    expect(component).toMatchSnapshot();
  });
});
