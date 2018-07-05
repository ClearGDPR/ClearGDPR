import React from 'react';
import { shallow } from 'enzyme';

import * as TestUtils from 'tests/helpers/TestUtils';

import { RegisterContainer as Register } from './Register';

const setupShallow = propOverrides => {
  const props = Object.assign(
    {
      registerUser: jest.fn().mockReturnValue(Promise.resolve()),
      closePanel: jest.fn(),
      isLoading: false
    },
    propOverrides
  );
  const component = shallow(<Register {...props} />);

  return { props, component };
};

describe('(Container) Change Password', () => {
  it('should render correctly when default props provided', async () => {
    const { component } = setupShallow();
    expect(component).toMatchSnapshot();
  });

  it('should populate errors on submit when register rejects with error', async () => {
    const { props, component } = setupShallow();

    props.registerUser.mockReturnValue(Promise.reject(new Error('Test error')));

    component.instance().onSubmit({ username: 'test.user', password: 'testPassword' });

    await TestUtils.flushPromises();
    expect(component.state()).toMatchSnapshot();
  });

  it('should close panel when registration succeeded', async () => {
    const { props, component } = setupShallow();
    component
      .instance()
      .onSubmit({ newPassword: 'testPassword', newPasswordRepeat: 'testPassword' });

    await TestUtils.flushPromises();
    expect(props.closePanel).toHaveBeenCalled();
  });

  describe('Validate password', () => {
    it('should return error when password is null or empty', async () => {
      const { component } = setupShallow();
      let result = component.instance().validatePassword('');
      expect(result).toEqual(
        expect.stringContaining('Field required')
      );
      result = component.instance().validatePassword();
      expect(result).toEqual(
        expect.stringContaining('Field required')
      );
    });

    it('should return error when password is too short', async () => {
      const { component } = setupShallow();
      let result = component.instance().validatePassword('asc');
      expect(result).toEqual(
        expect.stringContaining('Password must have min. 8 characters')
      );
      result = component.instance().validatePassword('asffas');
      expect(result).toEqual(
        expect.stringContaining('Password must have min. 8 characters')
      );
    });
  });
});
