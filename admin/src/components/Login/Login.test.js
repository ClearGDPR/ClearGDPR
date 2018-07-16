import React from 'react';
import { shallow } from 'enzyme';
import Login from './Login';

const setup = propOverrides => {
  const props = {
    auth: jest.fn(),
    isLoading: false,
    errors: {},
    ...propOverrides
  };


  const component = shallow(<Login {...props} />);

  return { props, component };
};

describe('(Component) Login', () => {
  it('should render correctly when not loading', () => {
    const { component } = setup();
    expect(component).toMatchSnapshot();
  });

  it('should render correctly when loading', () => {
    const { component } = setup({ isLoading: true });
    expect(component).toMatchSnapshot();
  });

  it('should render correctly when contains errors', () => {
    const { component } = setup({ errors: { server: 'Some test server error' } });
    expect(component).toMatchSnapshot();
  });
});
