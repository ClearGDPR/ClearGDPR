import React from 'react';
import ConsentDialContainer from './ConsentDial';
import { shallow, mount } from 'enzyme';
import { flushPromises } from 'tests/helpers/TestUtils';
import session from 'helpers/Session';
import toJson from 'enzyme-to-json';

jest.mock('helpers/Session');

beforeEach(() => {
  session.getToken.mockReturnValue('token');
});

const statsResponse = {
  data: {
    controller: {
      consented: 1,
      unconsented: 2,
      total: 3
    }
  }
};
describe('(Container) SubjectsList', () => {
  it('Should have the correct state after mounting', async () => {
    global.fetch = jest.fn().mockImplementationOnce(() =>
      Promise.resolve({
        status: 200,
        json: () => Promise.resolve(statsResponse)
      })
    );

    const component = mount(<ConsentDialContainer />);
    await flushPromises();

    expect(component.state()).toEqual(
      expect.objectContaining({
        data: { consented: 1, unconsented: 2, total: 3 },
        isLoading: false
      })
    );
  });

  it('should render correctly', async () => {
    global.fetch = jest.fn().mockImplementationOnce(() =>
      Promise.resolve({
        status: 200,
        json: () => Promise.resolve(statsResponse)
      })
    );

    const component = shallow(<ConsentDialContainer />);

    await flushPromises();
    expect(toJson(component)).toMatchSnapshot();
  });
});
