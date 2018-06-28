import React from 'react';
import { shallow } from 'enzyme';

import session from '../../helpers/Session';
import * as TestUtils from '../../tests/helpers/TestUtils';

import { ChangePasswordContainer as ChangePassword } from './ChangePassword';

jest.mock('../../helpers/Session');

const setupShallow = propOverrides => {
  const props = Object.assign({ userId: 1 }, propOverrides);
  const component = shallow(<ChangePassword {...props} />);

  return { props, component };
};

beforeEach(() => {
  session.getToken.mockReturnValue('token');
});

describe('(Container) Change Password', () => {
  it('should render correctly when user id provided props provided', async () => {
    const { component } = setupShallow();
    expect(component).toMatchSnapshot();
  });

  it('should populate errors on submit when fetch fails with 400 status', async () => {
    global.fetch = jest.fn().mockImplementationOnce(() =>
      Promise.resolve({
        status: 400,
        json: () => {
          return {
            message: 'This is an error message'
          };
        }
      })
    );

    const { component } = setupShallow();
    component
      .instance()
      .onSubmit({ newPassword: 'testPassword', newPasswordRepeat: 'testPassword' });

    await TestUtils.flushPromises();
    expect(component.state()).toEqual(
      expect.objectContaining({
        errors: {
          '': 'This is an error message'
        }
      })
    );
  });

  it('should populate errors on submit when fetch fails with 500 status', async () => {
    global.fetch = jest.fn().mockImplementationOnce(() =>
      Promise.resolve({
        status: 500
      })
    );

    const { component } = setupShallow();
    component
      .instance()
      .onSubmit({ newPassword: 'testPassword', newPasswordRepeat: 'testPassword' });

    await TestUtils.flushPromises();
    expect(component.state()).toEqual(
      expect.objectContaining({
        errors: {
          '': 'Unknown error occurred'
        }
      })
    );
  });

  it('should populate errors on submit when passwords do not match', async () => {
    const { component } = setupShallow();
    component
      .instance()
      .onSubmit({ newPassword: 'testPassword1', newPasswordRepeat: 'testPassword2' });

    await TestUtils.flushPromises();
    expect(component.state()).toEqual(
      expect.objectContaining({
        errors: {
          newPasswordRepeat: 'Passwords do not match!'
        }
      })
    );
  });

  it('should close panel when change password succeeded', async () => {
    global.fetch = jest.fn().mockImplementationOnce(() =>
      Promise.resolve({
        status: 200,
        json: () => ({
          success: true
        })
      })
    );

    const { props, component } = setupShallow({ closePanel: jest.fn() });
    component
      .instance()
      .onSubmit({ newPassword: 'testPassword', newPasswordRepeat: 'testPassword' });

    await TestUtils.flushPromises();
    expect(props.closePanel).toHaveBeenCalled();
    expect(component.state()).toEqual(
      expect.objectContaining({
        isLoading: false
      })
    );
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
