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
  // const component = shallow(<ChangePasswordForm {...props} />);
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

const checkFormState = state => {
  const formState = {
    values: {},
    touched: {},
    errors: {},
    pristine: true,
    dirty: false,
    invalid: false
  };
  expect(JSON.stringify(state)).to.deep.equal(JSON.stringify(formState));
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
    const onSubmit = jest.fn();
    const validatePassword = jest.fn();
    const { formApi, component } = setupForm({ onSubmit, validatePassword });

    // const newPasswordInput = mounted.find('input#newPassword');
    // newPasswordInput.simulate('change', { target: { value: 'testPassword' } });
    // const newPasswordRepeatInput = mounted.find('input#newPasswordRepeat');
    // newPasswordRepeatInput.simulate('change', { target: { value: 'testPassword' } });
    // const submitButton = mounted.find('button[type="submit"]');
    // submitButton.simulate('click');


    // const button = component.find('button[type="submit"]');
    // console.log(button.debug());
    // const form = component.find('form');
    // console.log(form.debug());
    // console.log(formApi.getState());

    const newPasswordInput = component.find('TextInput[field="newPassword"]').at(0);
    console.log(newPasswordInput.props());

    // console.log(component.debug());
    // console.log(formApi.getState());
    expect(validatePassword).toHaveBeenCalled();
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
