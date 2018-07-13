import React from 'react';
import { shallow } from 'enzyme';
import Login from './Login';

const setup = propOverrides => {
  const props = Object.assign(
    {
      auth: jest.fn()
    },
    propOverrides
  );

  const component = shallow(<Login {...props} />);

  return { props, component };
};

describe('(Component) Login', () => {
  it('should render correctly', () => {
    const { component } = setup();
    expect(component).toMatchSnapshot();
  });
});
