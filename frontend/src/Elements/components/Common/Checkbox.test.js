import React from 'react';
import { shallow } from 'enzyme';
import Checkbox from './Checkbox';

const setup = props => {
  return shallow(<Checkbox {...{ ...{ onClick: () => {} }, ...props }}>test</Checkbox>);
};

describe('Checkbox', () => {
  it('should render correctly', () => {
    const component = setup();
    expect(component).toMatchSnapshot();
  });

  it('should execute callback', () => {
    const callback = jest.fn();
    const component = setup({ onChange: callback });
    component.find('input').simulate('change');
    expect(callback).toBeCalled();
  });
});
