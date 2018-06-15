import React from 'react';
import { shallow } from 'enzyme';
import Login from './Login';

describe('(Component) Login', () => {
  it('should render correctly', () => {
    const output = shallow(<Login />);
    expect(output).toMatchSnapshot();
  });
});
