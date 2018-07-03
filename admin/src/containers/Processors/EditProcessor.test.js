import React from 'react';
import { shallow } from 'enzyme';

import session from '../../helpers/Session';
import * as TestUtils from '../../tests/helpers/TestUtils';

import { EditProcessorContainer } from './EditProcessor';

jest.mock('../../helpers/Session');

const setupShallow = propOverrides => {
  const props = Object.assign({ userId: 1 }, propOverrides);
  const component = shallow(<EditProcessorContainer {...props} />);

  return { props, component };
};

beforeEach(() => {
  session.getToken.mockReturnValue('token');
});

describe('(Container) Edit Processor', () => {
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
    component.instance().onSubmit();

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
    component.instance().onSubmit();

    await TestUtils.flushPromises();
    expect(component.state()).toEqual(
      expect.objectContaining({
        errors: {
          '': 'Unknown error occurred'
        }
      })
    );
  });

  it('should close panel when update processor succeeded', async () => {
    global.fetch = jest.fn().mockImplementationOnce(() =>
      Promise.resolve({
        status: 200,
        json: () => ({
          success: true
        })
      })
    );

    const { props, component } = setupShallow({ closePanel: jest.fn() });
    component.instance().onSubmit();

    await TestUtils.flushPromises();
    expect(props.closePanel).toHaveBeenCalled();
    expect(component.state()).toEqual(
      expect.objectContaining({
        isLoading: false
      })
    );
  });
});
