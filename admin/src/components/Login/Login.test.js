import React from 'react';
import enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Login from './Login';

enzyme.configure({ adapter: new Adapter() });

describe('(Component) Login', () => {
  it('should render correctly', () => {
    const output = shallow(<Login />);
    expect(output).toMatchSnapshot();
  });
});
