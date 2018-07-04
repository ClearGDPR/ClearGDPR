import React from 'react';
import SubjectsListContainer from './SubjectsList';
import { shallow, mount } from 'enzyme';
import { flushPromises } from 'tests/helpers/TestUtils';
import session from 'helpers/Session';

jest.mock('helpers/Session');

beforeEach(() => {
  session.getToken.mockReturnValue('token');
});

const subjectsResponse = {
  paging: {
    total: 4,
    current: 1
  },
  data: []
};
describe('(Container) SubjectsList', () => {
  it('Should have the correct state after mounting', async () => {
    global.fetch = jest.fn().mockImplementationOnce(() =>
      Promise.resolve({
        status: 200,
        json: () => Promise.resolve(subjectsResponse)
      })
    );

    const component = mount(<SubjectsListContainer />);
    await flushPromises();

    expect(component.state()).toEqual(
      expect.objectContaining({
        paging: { total: 4, current: 1 },
        subjects: [],
        isLoading: false,
        errorState: false
      })
    );
  });

  it('should render correctly', async () => {
    global.fetch = jest.fn().mockImplementationOnce(() =>
      Promise.resolve({
        status: 200,
        json: () => Promise.resolve(subjectsResponse)
      })
    );

    const component = shallow(<SubjectsListContainer />);

    await flushPromises();
    expect(component).toMatchSnapshot();
  });

  it('Should update state correctly when paging', async () => {
    global.fetch = jest.fn().mockImplementationOnce(() =>
      Promise.resolve({
        status: 200,
        json: () => Promise.resolve(subjectsResponse)
      })
    );

    const component = mount(<SubjectsListContainer />);
    await flushPromises();

    global.fetch = jest.fn().mockImplementationOnce(() =>
      Promise.resolve({
        status: 200,
        json: () =>
          Promise.resolve(Object.assign({}, subjectsResponse, { paging: { total: 4, current: 2 } }))
      })
    );

    component.instance().fetchSubjects(2);
    await flushPromises();

    expect(component.state()).toEqual(
      expect.objectContaining({ paging: { current: 2, total: 4 } })
    );
  });
});
