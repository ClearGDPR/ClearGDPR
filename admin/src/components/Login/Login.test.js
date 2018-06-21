import React from 'react';
import { shallow } from 'enzyme';
import Login from './Login';

const props = {
  auth: jest.fn()
};

describe('(Component) Login', () => {
  it('should render correctly', () => {
    const component = shallow(<Login {...props} />);
    expect(component).toMatchSnapshot();
  });

  it('should render errors', () => {
    const component = shallow(<Login {...props} />);
    expect(component).toMatchSnapshot();
  });
});
