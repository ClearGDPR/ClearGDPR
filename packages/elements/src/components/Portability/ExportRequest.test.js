import React from 'react';
import { shallow } from 'enzyme';
import FileSaver from 'file-saver';
import ExportRequest from './ExportRequest';
import Subject from 'contexts/Subject';

jest.useFakeTimers();

const testData = {
  name: 'John',
  email: 'john@gmail.com'
};
const cg = {
  Subject: {
    accessData: async () => {
      return testData;
    }
  }
};

const subject = new Subject(cg, { data: testData });

const setup = () => {
  return shallow(<ExportRequest options={{ label: 'Load data' }} subject={subject} />);
};

describe('ExportRequest', () => {
  let spy;
  let saveAs;

  beforeEach(() => {
    saveAs = FileSaver.saveAs;
    FileSaver.saveAs = () => {};
  });

  it('should render correctly', () => {
    const component = setup();
    expect(component).toMatchSnapshot();
  });

  it('should toggle itself into processing state before export', () => {
    const component = setup();
    component.simulate('click');
    const { success, processing } = component.state();
    expect(success).toBe(false);
    expect(processing).toBe(true);
  });

  it('should request access to subjects data', async () => {
    spy = jest.spyOn(subject, 'fetchData');
    const component = setup();
    await component.simulate('click');
    expect(spy).toBeCalled();
  });

  it('should use FileSaver to save received data', async () => {
    spy = jest.spyOn(FileSaver, 'saveAs');
    const component = setup();
    await component.simulate('click');
    jest.runAllTimers();
    expect(spy).toBeCalledWith(expect.any(Blob), 'personal_data.json');
  });

  it('should toggle itself into success state', async () => {
    const component = setup();
    await component.simulate('click');
    jest.runAllTimers();
    const { success, processing } = component.state();
    expect(success).toBe(true);
    expect(processing).toBe(false);
  });

  afterEach(() => {
    if (spy) {
      spy.mockClear();
    }
    FileSaver.saveAs = saveAs;
  });
});
