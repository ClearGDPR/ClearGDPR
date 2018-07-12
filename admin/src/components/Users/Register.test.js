import React from 'react';
import { shallow, mount } from 'enzyme';

import RegisterForm, { Register } from './Register';

const setupShallow = propOverrides => {
  const props = Object.assign(
    {
      onSubmit: jest.fn()
    },
    propOverrides
  );
  const component = shallow(<Register {...props} />);

  return { props, component };
};

const setupForm = propOverrides => {
  let formApi;
  const props = Object.assign({}, propOverrides);
  const component = mount(
    <RegisterForm
      {...props}
      getApi={api => {
        formApi = api;
      }}
    />
  );

  return { formApi, props, component };
};

describe('(Component) Register', () => {
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

  it('should validate form and submit when is OK', async () => {
    const onSubmit = jest.fn();
    const validatePassword = jest.fn();
    const { formApi, component } = setupForm({ onSubmit, validatePassword });

    formApi.setValues({
      username: 'testUsername',
      password: 'testPassword'
    });

    component.find('form').simulate('submit');

    expect(validatePassword).toHaveBeenCalledTimes(1);
    expect(formApi.getState().errors).toEqual({});
    expect(onSubmit).toHaveBeenCalled();
  });

  it('should validate form and prevent submit when is BAD', async () => {
    const onSubmit = jest.fn();
    const validatePassword = jest.fn().mockReturnValue('error');
    const { formApi, component } = setupForm({ onSubmit, validatePassword });

    formApi.setValues({
      username: undefined,
      password: 'test'
    });

    component.find('form').simulate('submit');

    expect(validatePassword).toHaveBeenCalledTimes(1);
    expect(formApi.getState().errors).toEqual({ password: 'error' });
    expect(formApi.getState().invalid).toEqual(true);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('should render correct props when touched', async () => {
    const { component } = setupShallow({
      isLoading: false,
      touched: { password: true }
    });

    const passwordInput = component.find('TextInput[field="password"]').at(0);

    expect(passwordInput.props().error).toBeFalsy();
  });

  it('should render correct props when touched and there are errors', async () => {
    const { component } = setupShallow({
      isLoading: false,
      touched: { password: true },
      errors: { password: 'Error message' }
    });

    const passwordInput = component.find('TextInput[field="password"]').at(0);

    expect(passwordInput.props().error).toEqual('Error message');
  });
});
