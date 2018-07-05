import React from 'react';
import { mount, shallow } from 'enzyme';

import { RectificationsContainer } from 'containers/Rectifications/Rectifications';

const rectifications = {
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
  const props = Object.assign(
    {
      pendingRectifications: { ...rectifications },
      processedRectifications: { ...rectifications },
      fetchAllRectifications: jest.fn(),
      fetchPendingRectifications: jest.fn(),
      fetchProcessedRectifications: jest.fn(),
      isLoading: false
    },
    propOverrides
  );
  const component = shallow(<RectificationsContainer {...props} />);
  const mounted = mount(<RectificationsContainer {...props} />);

  return { props, component, mount: mounted };
};

describe('(Container) Rectifications', () => {
  it('should have correct props and state after mounting', async () => {
    const { component } = setup();

    expect(component.instance().props).toEqual(
      expect.objectContaining({
        pendingRectifications: expect.objectContaining(rectifications),
        processedRectifications: expect.objectContaining(rectifications)
      })
    );
    expect(component.state()).toEqual(
      expect.objectContaining({
        selectedTab: 0,
        tabs: ['Pending requests', 'Requests archive']
      })
    );
  });

  it('should pass correct props after mounting with empty data', async () => {
    const { component } = setup({ pendingRectifications: {}, processedRectifications: {} });

    expect(component.props()).toEqual(
      expect.objectContaining({
        tabs: ['Pending requests', 'Requests archive'],
        selectedTab: 0,
        currentPage: 1,
        pageCount: 1,
        data: [],
        isLoading: false
      })
    );
  });

  it('should pass correct props after mounting', async () => {
    const { component } = setup();

    expect(component.props()).toEqual(
      expect.objectContaining({
        tabs: ['Pending requests', 'Requests archive'],
        selectedTab: 0,
        currentPage: rectifications.paging.current,
        pageCount: rectifications.paging.total,
        data: expect.objectContaining(rectifications.data),
        isLoading: false
      })
    );
  });

  it('should render correctly', async () => {
    const { component } = setup();
    expect(component).toMatchSnapshot();
  });

  it('should should fetch pending rectifications on default tab', async () => {
    const { component } = setup();
    component.instance().onPageSelected(2);
    expect(component.instance().props.fetchPendingRectifications).toHaveBeenCalledWith(2);
  });

  it('should should have correct state after setting the tab', async () => {
    const { component } = setup();
    component.instance().onTabSelect(1);
    expect(component.state()).toEqual(
      expect.objectContaining({
        selectedTab: 1
      })
    );
  });

  it('should should fetch processed rectifications on default tab', async () => {
    const { component } = setup();
    component.instance().onTabSelect(1);
    component.instance().onPageSelected(2);
    expect(component.instance().props.fetchProcessedRectifications).toHaveBeenCalledWith(2);
  });

  it('should fetch rectifications after mounting the component', async () => {
    const { mount } = setup();
    expect(mount.instance().props.fetchAllRectifications).toHaveBeenCalled();
  });
});
