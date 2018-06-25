import React from 'react';
import { shallow } from 'enzyme';

import { ChangePasswordContainer as ChangePassword } from './ChangePassword';

const setupShallow = propOverrides => {
  const props = Object.assign({ userId: 1 }, propOverrides);
  const component = shallow(<ChangePassword {...props} />);

  return { props, component };
};

describe('(Component) Change Password', () => {
  it('should render correctly when user id provided props provided', async () => {
    const { component } = setupShallow();
    expect(component).toMatchSnapshot();
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
