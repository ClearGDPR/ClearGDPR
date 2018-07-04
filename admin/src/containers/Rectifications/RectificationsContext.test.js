import React from 'react';

import { shallow } from 'enzyme';

import { RectificationsProvider } from '../Rectifications/RectificationsContext';
import session from 'helpers/Session';
import * as TestUtils from 'tests/helpers/TestUtils';
import { toast } from 'react-toastify';

jest.mock('react-toastify');
jest.mock('helpers/Session');

beforeEach(() => {
  session.getToken.mockReturnValue('token');
  jest.clearAllMocks();
});

describe('RectificationsProvider', () => {
  const pendingRectifications = {
    data: [
      {
        id: 1,
        request_reason: 'The data was incorrect.',
        created_at: '2018-07-02T21:31:24.999Z'
      },
      {
        id: 2,
        request_reason: 'The data was incorrect two.',
        created_at: '2018-07-02T21:31:37.440Z'
      },
      {
        id: 3,
        request_reason: 'The data was incorrect two three.',
        created_at: '2018-07-02T21:31:43.530Z'
      }
    ],
    paging: {
      current: 1,
      total: 2
    }
  };

  const processedRectifications = {
    data: [
      {
        id: 4,
        request_reason: 'The data was incorrect.',
        created_at: '2018-07-02T21:31:24.999Z',
        status: 'APPROVED'
      },
      {
        id: 5,
        request_reason: 'The data was incorrect two.',
        created_at: '2018-07-02T21:31:37.440Z',
        status: 'DISAPPROVED'
      },
      {
        id: 6,
        request_reason: 'The data was incorrect two three.',
        created_at: '2018-07-02T21:31:43.530Z',
        status: 'APPROVED'
      }
    ],
    paging: {
      current: 1,
      total: 2
    }
  };

  const setupShallow = propOverrides => {
    const props = Object.assign({}, propOverrides);
    const component = shallow(<RectificationsProvider {...props} />);

    return { props, component };
  };

  it('should have correct state after fetching all rectifications', async () => {
    let i = 0;
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        status: 200,
        json: () => {
          return 0 === i++ ? pendingRectifications : processedRectifications;
        }
      })
    );

    const { component } = setupShallow();
    await component.instance().fetchAllRectifications();

    await TestUtils.flushPromises();

    expect(component.state()).toEqual(
      expect.objectContaining({
        pendingRectifications,
        processedRectifications,
        isLoading: false
      })
    );
  });

  it('should have correct state after fetching pending rectifications', async () => {
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        status: 200,
        json: () => {
          return pendingRectifications;
        }
      })
    );

    const { component } = setupShallow();
    await component.instance().fetchPendingRectifications();

    await TestUtils.flushPromises();

    expect(component.state()).toEqual(
      expect.objectContaining({
        pendingRectifications,
        processedRectifications: {},
        isLoading: false
      })
    );
  });

  it('should have correct state after fetching processed rectifications', async () => {
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        status: 200,
        json: () => {
          return processedRectifications;
        }
      })
    );

    const { component } = setupShallow();
    await component.instance().fetchProcessedRectifications();

    await TestUtils.flushPromises();

    expect(component.state()).toEqual(
      expect.objectContaining({
        pendingRectifications: {},
        processedRectifications,
        isLoading: false
      })
    );
  });

  it('Should toast.error when the API gives a bad response', async () => {
    global.fetch = jest.fn().mockImplementationOnce(() =>
      Promise.resolve({
        status: 404,
        json: () => ({ error: 'Error message' })
      })
    );

    const { component } = setupShallow();

    try {
      await component.instance().fetchAllRectifications();
    } catch (e) {
      //not-empty
    }

    expect(toast.error).toHaveBeenCalledWith('An error occurred: Error message');
  });

  it('should throw error when fetching all rectifications returned HTTP 500', async () => {
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        status: 500
      })
    );

    const { component } = setupShallow();

    await component.instance().fetchAllRectifications();

    expect(component.state()).toEqual(
      expect.objectContaining({
        isLoading: false
      })
    );
  });

  it('should render correctly', async () => {
    global.fetch = jest.fn().mockImplementationOnce(() =>
      Promise.resolve({
        status: 200,
        json: () => {
          return pendingRectifications;
        }
      })
    );

    const { component } = setupShallow();

    await TestUtils.flushPromises();
    expect(component).toMatchSnapshot();
  });
});
