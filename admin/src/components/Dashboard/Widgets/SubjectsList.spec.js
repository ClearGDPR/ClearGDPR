import React from 'react';
import { shallow } from 'enzyme';
import SubjectsList from './SubjectsList';

const props = {
  subjects: [
    {
      id: '0x0',
      data: {
        firstname: 'test',
        email: 'test@test.com'
      },
      consented_on: '2018-07-04T18:33:43.534Z'
    }
  ],
  isLoading: false,
  errorState: false
};

describe('(Component) Processors', () => {
  it('should render', () => {
    const component = shallow(<SubjectsList {...props} />);
    expect(component).toMatchSnapshot();
  });

  it('should render if loading', () => {
    const component = shallow(<SubjectsList {...Object.assign({}, props, { loading: true })} />);
    expect(component).toMatchSnapshot();
  });
});
