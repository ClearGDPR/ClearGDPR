import React from 'react';

import { shallow } from 'enzyme';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

import internalFetch from 'helpers/internal-fetch';
import * as TestUtils from 'tests/helpers/TestUtils';

import { RectificationsProvider } from '../Rectifications/RectificationsContext';
import * as lodash from 'lodash';

jest.mock('date-fns');
jest.mock('react-toastify');
jest.mock('helpers/internal-fetch');

beforeAll(() =>
  format.mockImplementation(date => {
    return date.toUTCString();
  }));

beforeEach(() => {
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

  const setup = propOverrides => {
    const props = Object.assign({}, propOverrides);
    const component = shallow(<RectificationsProvider {...props} />);

    return { props, component };
  };

  it('should render correctly', async () => {
    internalFetch.mockReturnValue(Promise.resolve(pendingRectifications));

    const { component } = setup();

    await TestUtils.flushPromises();
    expect(component).toMatchSnapshot();
  });

  describe('fetching rectifications', () => {
    it('should have correct state after fetching all', async () => {
      let i = 0;
      internalFetch.mockImplementation(() =>
        Promise.resolve(0 === i++ ? pendingRectifications : processedRectifications)
      );

      const { component } = setup();
      await component.instance().fetchAllRectifications();

      await TestUtils.flushPromises();

      let state = component.state();
      expect(state).toEqual(
        expect.objectContaining({
          isLoading: false
        })
      );
      expect(state.pendingRectifications).toMatchSnapshot();
      expect(state.processedRectifications).toMatchSnapshot();
    });

    it('should have correct state after fetching pending', async () => {
      internalFetch.mockReturnValue(Promise.resolve(pendingRectifications));

      const { component } = setup();
      await component.instance().fetchPendingRectifications();

      await TestUtils.flushPromises();

      let state = component.state();
      expect(state).toEqual(
        expect.objectContaining({
          processedRectifications: { paging: { current: 1 } },
          isLoading: false
        })
      );
      expect(state.pendingRectifications).toMatchSnapshot();
    });

    it('should have correct state after fetching processed', async () => {
      internalFetch.mockReturnValue(Promise.resolve(processedRectifications));

      const { component } = setup();
      await component.instance().fetchProcessedRectifications();

      await TestUtils.flushPromises();

      let state = component.state();
      expect(state).toEqual(
        expect.objectContaining({
          pendingRectifications: { paging: { current: 1 } },
          isLoading: false
        })
      );
      expect(state.processedRectifications).toMatchSnapshot();
    });

    it('should have correct state when calling API returns error', async () => {
      internalFetch.mockReturnValue(Promise.reject(new Error('Error message')));

      const { component } = setup();

      try {
        await component.instance().fetchAllRectifications();
      } catch (e) {
        //not-empty
      }

      expect(component.state()).toEqual(
        expect.objectContaining({
          isLoading: false
        })
      );
    });
  });

  describe('approve rectification', () => {
    it('should refresh rectifications', async () => {
      const newPending = {
        ...pendingRectifications,
        data: pendingRectifications.data.filter(r => r.id !== 1)
      };
      const newProcessed = {
        ...processedRectifications,
        data: [
          ...processedRectifications.data,
          {
            id: 1,
            request_reason: 'The data was incorrect.',
            created_at: '2018-07-02T21:31:24.999Z'
          }
        ]
      };

      internalFetch.mockImplementation(url => {
        if (lodash.includes(url, 'rectification-requests/archive')) {
          return Promise.resolve(newProcessed);
        } else if (lodash.includes(url, 'rectification-requests')) {
          return Promise.resolve(newPending);
        } else {
          return Promise.resolve({ success: true });
        }
      });

      const { component } = setup();

      await component.instance().approveRectification(973);

      const state = component.state();
      expect(state).toEqual(
        expect.objectContaining({
          isLoading: false,
          pendingRectifications: component.instance()._mapRectificationResults(newPending),
          processedRectifications: component.instance()._mapRectificationResults(newProcessed)
        })
      );
      expect(toast.success).toHaveBeenCalledWith('Rectification request approved');
    });

    it('should stop loading when approval fails', async () => {
      internalFetch.mockReturnValue(Promise.reject(new Error('Error message')));

      const { component } = setup();

      try {
        await component.instance().approveRectification(2);
      } catch (e) {
        //not-empty
      }

      expect(component.state()).toEqual(
        expect.objectContaining({
          isLoading: false
        })
      );
    });
  });
});
