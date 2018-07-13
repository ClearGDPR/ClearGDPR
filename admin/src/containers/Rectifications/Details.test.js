import React from 'react';
import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import { format } from 'date-fns';

import internalFetch from 'helpers/internal-fetch';
import { flushPromises } from 'tests/helpers/TestUtils';

import { DetailsContainer } from './Details';

jest.mock('date-fns');
jest.mock('react-toastify');
jest.mock('helpers/internal-fetch');

const rectification = {
  id: 1,
  currentData: {
    firstName: 'Johnny',
    email: 'jb@coolcartoons.io',
    someKey: 'Some data goes here'
  },
  updates: {
    lastName: 'Bravo'
  },
  createdAt: '2018-07-10T16:14:20.742Z',
  status: 'PENDING'
};

beforeAll(() =>
  format.mockImplementation(date => {
    return date.toUTCString();
  }));

beforeEach(() => {
  jest.clearAllMocks();

  internalFetch.mockReturnValue(Promise.resolve(rectification));
});

const setup = propOverrides => {
  const props = {
    approveRectification: jest.fn(),
    rectificationId: 1,
    closePanel: jest.fn(),
    isLoading: false,
    ...propOverrides
  };
  const component = shallow(<DetailsContainer {...props} />);
  const mounted = mount(<DetailsContainer {...props} />);

  return { props, component, mounted };
};

describe('(Container) Rectification details', () => {
  it('should render when not loading correctly', () => {
    const { component } = setup();
    expect(toJson(component)).toMatchSnapshot();
  });

  it('should render when loading correctly', () => {
    const { component } = setup({ isLoading: true });
    expect(toJson(component)).toMatchSnapshot();
  });

  it('should have correct state after mounting', async () => {
    const { mounted } = setup();

    await flushPromises();

    expect(mounted.state()).toEqual({
      isLoading: false,
      rectification: {
        created_at: 'Tue, 10 Jul 2018 16:14:20 GMT',
        currentData: {
          email: 'jb@coolcartoons.io',
          firstName: 'Johnny',
          someKey: 'Some data goes here'
        },
        status: 'PENDING',
        updates: { lastName: 'Bravo' }
      }
    });
  });

  it('should call approveRectification and close panel on approval', async () => {
    const { props, component } = setup({ rectificationId: 123 });
    props.approveRectification.mockReturnValue(Promise.resolve());
    component.instance().onApprove();
    expect(props.approveRectification).toHaveBeenCalledWith(123);

    await flushPromises();
    expect(props.closePanel).toHaveBeenCalled();
  });

  it('should not close panel when approval failed', async () => {
    const { props, component } = setup({ rectificationId: 456 });
    props.approveRectification.mockReturnValue(Promise.reject('Some error'));
    component.instance().onApprove();
    expect(props.approveRectification).toHaveBeenCalledWith(456);

    await flushPromises().catch(() => {});
    expect(props.closePanel).not.toHaveBeenCalled();
    expect(component.state()).toEqual(
      expect.objectContaining({
        isLoading: false
      })
    );
  });

  it('should be in loading state when props isLoading is true', () => {
    const { component } = setup({ isLoading: true });
    expect(component.instance().isLoading).toBe(true);
  });

  it('should be in loading state when mounting and promise has not resolved', () => {
    const { mounted } = setup();
    expect(mounted.instance().isLoading).toBe(true);
  });
});
