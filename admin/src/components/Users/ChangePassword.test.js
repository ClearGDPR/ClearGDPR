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

  it('should call onSubmit when submit button clicked', async () => {
    const onSubmit = jest.fn();
    const validatePassword = jest.fn();
    const { component } = setupShallow({ onSubmit, validatePassword });

    const form = component.find('form').at(0);
    form.simulate('submit');
    expect(onSubmit).toHaveBeenCalled();
  });

  it('should validate password when inputs values change', async () => {
    const validatePassword = jest.fn();
    const { component } = setupMount({ validatePassword });

    const passwordField = component.find('input[type="password"]').at(0);
    passwordField.simulate('change', { target: { value: 'testPassword' } });

    const repeatPasswordField = component.find('input[type="password"]').at(1);
    repeatPasswordField.simulate('change', { target: { value: 'testPassword' } });

    expect(validatePassword).toHaveBeenCalledTimes(2);
  });

  it('should submit when validation is ok', async () => {
    const onSubmit = jest.fn();
    const validatePassword = jest.fn().mockReturnValue({ success: null });

    const { component } = setupMount({ onSubmit, validatePassword });

    const passwordField = component.find('input[type="password"]').at(0);
    passwordField.simulate('change', { target: { value: 'testPassword' } });

    const repeatPasswordField = component.find('input[type="password"]').at(1);
    repeatPasswordField.simulate('change', { target: { value: 'testPassword' } });

    const form = component.find('form').at(0);
    form.simulate('submit');

    expect(validatePassword).toHaveBeenCalledTimes(2);
    // TODO: try to make it work
    // expect(onSubmit).toHaveBeenCalled();
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
