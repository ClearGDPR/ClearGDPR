import React from 'react';
import { shallow } from 'enzyme';
import Switch from './Switch';

const setup = props => {
  return shallow(<Switch {...Object.assign({ onChange: () => {} }, props)} />);
};

describe('Switch', () => {
  it('should render correctly', () => {
    const component = setup();
    expect(component).toMatchSnapshot();
  });

  it('should execute callback', () => {
    const callback = jest.fn();
    const component = setup({ onChange: callback });
    component.simulate('click');
    expect(callback).toBeCalled();
  });
});
