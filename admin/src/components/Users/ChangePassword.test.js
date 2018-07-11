import React from 'react';
import { shallow, mount } from 'enzyme';

import ChangePasswordForm, { ChangePassword } from './ChangePassword';

const setupShallow = propOverrides => {
  const props = Object.assign({}, propOverrides);
  const component = shallow(<ChangePassword {...props} />);

  return { props, component };
};

const setupMount = propOverrides => {
  const props = Object.assign({}, propOverrides);
  const component = mount(<ChangePasswordForm {...props} />);

  return { props, component };
};

describe('(Component) Change Password', () => {
  it('should render correctly when no props provided', async () => {
    const { component } = setupShallow();
    expect(component).toMatchSnapshot();
  });

  it('should render correctly when the prop isLoading is set to false', async () => {
    const { component } = setupShallow({ isLoading: false });
    expect(component).toMatchSnapshot();
  });

  it('should render correctly when the prop isLoading is set to true', async () => {
    const { component } = setupShallow({ isLoading: true });
    expect(component).toMatchSnapshot();
  });

  it('should validate password when inputs values change', async () => {
    // TODO: refactor 
  });

  it('should submit when validation is ok', async () => {
    // TODO: refactor
  });

  it('should render correct props when touched', async () => {
    const { component } = setupShallow({
      isLoading: false,
      touched: { newPassword: true }
    });

    const newPasswordInput = component.find('TextInput[field="newPassword"]').at(0);
    expect(newPasswordInput.props().error).toBeFalsy();
  });

  it('should render correct props when touched and there are errors', async () => {
    const { component } = setupShallow({
      isLoading: false,
      touched: { newPassword: true },
      errors: { newPassword: 'Error message' }
    });

    const newPasswordInput = component.find('TextInput[field="newPassword"]').at(0);

    expect(newPasswordInput.props().error).toEqual('Error message');
  });
});
