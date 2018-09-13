import React from 'react';
import { shallow } from 'enzyme';
import Switch from './Switch';

const setup = props => {
  return shallow(<Switch {...{ ...{ onChange: () => {} }, ...props }} />);
};

describe('Switch', () => {
  it('should render correctly', () => {
    const component = setup();
    expect(component).toMatchSnapshot();
  });

  xit('should execute callback', () => {
    const callback = jest.fn();
    const component = setup({ onChange: callback });
    component.simulate('click');
    expect(callback).toBeCalled();
  });

  it('should do nothing in disabled state', () => {
    const callback = jest.fn();
    const component = setup({ onChange: callback, disabled: true });
    component.simulate('click');
    expect(callback).not.toBeCalled();
  });

  xit('should update state value when receive new props', () => {
    const component = setup({ value: true });
    component.setProps({ value: false });
    expect(component.state().value).toBe(false);
  });
});
