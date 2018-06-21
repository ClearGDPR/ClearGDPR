import React from 'react';
import { shallow } from 'enzyme';

import { ChangePassword } from './ChangePassword';

const setup = propOverrides => {
  const props = Object.assign({}, propOverrides);
  const component = shallow(<ChangePassword {...props} />);

  return { props, component };
};

describe('(Component) Change Password', () => {
  it('should render correctly when no props provided', async () => {
    const { component } = setup();
    expect(component).toMatchSnapshot();
  });

  it('should render correctly when the prop isLoading is set to false', async () => {
    const { component } = setup({ isLoading: false });
    expect(component).toMatchSnapshot();
  });

  it('should render correctly when the prop isLoading is set to true', async () => {
    const { component } = setup({ isLoading: true });
    expect(component).toMatchSnapshot();
  });
});
