import React from 'react';
import DashboardContainer from './Dashboard';
import { shallow } from 'enzyme';
import session from 'helpers/Session';

jest.mock('helpers/Session');

beforeEach(() => {
  session.getToken.mockReturnValue('token');
});

describe('(Container) Dashboard', () => {
  it('Should render without an error', () => {
    const component = shallow(<DashboardContainer />);
    expect(component).toMatchSnapshot();
  });
});
