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
    const { component } = setupMount({ onSubmit });

    const submitButton = component.find('input[type="submit"]').at(0);
    submitButton.simulate('submit');
    expect(onSubmit).toHaveBeenCalled();
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

  describe('Validate password', () => {
    it('should return error when password is null or empty', async () => {
      const { component } = setupShallow();
      let result = component.instance().validatePassword('');
      expect(result).toEqual(
        expect.objectContaining({
          error: 'Field required'
        })
      );
      result = component.instance().validatePassword();
      expect(result).toEqual(
        expect.objectContaining({
          error: 'Field required'
        })
      );
    });

    it('should return error when password is too short', async () => {
      const { component } = setupShallow();
      let result = component.instance().validatePassword('asc');
      expect(result).toEqual(
        expect.objectContaining({
          error: 'Password must have min. 8 characters'
        })
      );
      result = component.instance().validatePassword('asffas');
      expect(result).toEqual(
        expect.objectContaining({
          error: 'Password must have min. 8 characters'
        })
      );
    });
  });
});
