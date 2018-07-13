import React from 'react';
import { shallow } from 'enzyme';
import SubjectsList from './SubjectsList';

const setup = propOverrides => {
  const props = Object.assign(
    {
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
    },
    propOverrides
  );
  const component = shallow(<SubjectsList {...props} />);

  return { props, component };
};

describe('(Component) SubjectList', () => {
  it('should render', () => {
    const { component } = setup();
    expect(component).toMatchSnapshot();
  });

  it('should render if loading', () => {
    const { component } = setup({ isLoading: true });
    expect(component).toMatchSnapshot();
  });
});
