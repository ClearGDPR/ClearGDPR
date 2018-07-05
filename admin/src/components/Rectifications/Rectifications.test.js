import React from 'react';
import { shallow } from 'enzyme';
import Rectifications from './Rectifications';

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
      data: rectifications.data,
      tabs: ['tab 1', 'tab 2'],
      selectedTab: 0,
      onTabSelect: jest.fn(),
      pageCount: rectifications.paging.total,
      currentPage: rectifications.paging.current,
      onPageSelected: jest.fn(),
      isLoading: false
    },
    propOverrides
  );
  const component = shallow(<Rectifications {...props} />);

  return { props, component };
};

describe('(Component) Rectifications', () => {
  it('should render when not loading correctly', () => {
    const { component } = setup();
    expect(component).toMatchSnapshot();
  });

  it('should render when loading correctly', () => {
    const component = setup({ isLoading: true });
    expect(component).toMatchSnapshot();
  });
});
