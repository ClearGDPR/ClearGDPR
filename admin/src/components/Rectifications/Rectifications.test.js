import React from 'react';
import { shallow } from 'enzyme';
import Rectifications from './Rectifications';

const rectifications = {
  data: [
    {
      id: 4,
      request_reason: 'The data was incorrect.',
      created_at: '02/07/2018 9:31pm',
      status: 'APPROVED'
    },
    {
      id: 5,
      request_reason: 'The data was incorrect two.',
      created_at: '02/07/2018 9:35pm',
      status: 'DISAPPROVED'
    },
    {
      id: 6,
      request_reason: 'The data was incorrect two three.',
      created_at: '02/07/2018 9:31pm',
      status: 'APPROVED'
    }
  ],
  paging: {
    current: 1,
    total: 2
  }
};

const setup = propOverrides => {
  const props = {
    data: rectifications.data,
    tabs: ['tab 1', 'tab 2'],
    selectedTab: 0,
    onTabSelect: jest.fn(),
    pageCount: rectifications.paging.total,
    currentPage: rectifications.paging.current,
    onPageSelected: jest.fn(),
    isLoading: false,
    onDetailsClick: jest.fn(),
    ...propOverrides
  };

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
