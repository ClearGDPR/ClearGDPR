import React from 'react';
import { shallow, mount } from 'enzyme';

import ChangePasswordForm, { ChangePassword } from './ChangePassword';

const setupShallow = propOverrides => {
  const props = Object.assign({}, propOverrides);
  const component = shallow(<ChangePassword {...props} />);

  return { props, component };
};

const setupForm = propOverrides => {
  let formApi;
  const props = Object.assign({}, propOverrides);
  const component = mount(
    <ChangePasswordForm
      {...props}
      getApi={api => {
        formApi = api;
      }}
    />
  );

  return { formApi, props, component };
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

  it('should validate password when bluring outside the input', async () => {
    const onSubmit = jest.fn();
    const validatePassword = jest.fn();
    const { formApi, component } = setupForm({ onSubmit, validatePassword });

    formApi.setValues({
      newPassword: 'testPassword',
      newPasswordRepeat: 'testPassword'
    });

    const newPasswordInput = component.find('input#newPassword');
    newPasswordInput.simulate('blur');

    const newPasswordRepeatInput = component.find('input#newPasswordRepeat');
    newPasswordRepeatInput.simulate('blur');

    expect(validatePassword).toHaveBeenCalledTimes(2);
  });

  it('should submit form when validation is ok', async () => {
    const onSubmit = jest.fn();
    const validatePassword = jest.fn().mockReturnValue(null);
    const { component } = setupForm({ onSubmit, validatePassword });

    component.find('form').simulate('submit');

    expect(validatePassword).toHaveBeenCalledTimes(2);
    expect(onSubmit).toHaveBeenCalled();
  });

  it('should prevent submit form when validation is bad', async () => {
    const onSubmit = jest.fn();
    const validatePassword = jest.fn().mockReturnValue('error');
    const { formApi, component } = setupForm({ onSubmit, validatePassword });

    component.find('form').simulate('submit');

    expect(formApi.getState().errors).toEqual({
      newPassword: 'error',
      newPasswordRepeat: 'error'
    });
    expect(validatePassword).toHaveBeenCalledTimes(2);
    expect(onSubmit).not.toHaveBeenCalled();
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
