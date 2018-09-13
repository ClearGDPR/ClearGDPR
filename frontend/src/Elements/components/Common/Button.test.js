import React from 'react';
import { shallow } from 'enzyme';
import Button from './Button';

const setup = props => {
  return shallow(<Button {...{ ...{ onClick: () => {} }, ...props }}>test</Button>);
};

describe('Button', () => {
  it('should render correctly', () => {
    const component = setup();
    expect(component).toMatchSnapshot();
  });

  it('should execute callback', () => {
    const callback = jest.fn();
    const component = setup({ onClick: callback });
    component.simulate('click');
    expect(callback).toBeCalled();
  });
});
