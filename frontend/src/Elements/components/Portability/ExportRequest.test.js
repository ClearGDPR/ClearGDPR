import React from 'react';
import { shallow } from 'enzyme';
import FileSaver from 'file-saver';
import ExportRequest from './ExportRequest';

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

const setup = () => {
  return shallow(<ExportRequest options={{ label: 'Load data' }} cg={cg} />);
};

describe('ExportRequest', () => {
  let spy;

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
    spy = jest.spyOn(cg.Subject, 'accessData');
    const component = setup();
    await component.simulate('click');
    expect(spy).toBeCalled();
  });

  it('should use FileSaver to save received data', async () => {
    spy = jest.spyOn(FileSaver, 'saveAs');
    const component = setup();
    await component.simulate('click');
    expect(spy).toBeCalledWith(expect.any(Blob), 'personal_data.json');
  });

  it('should toggle itself into success state', async () => {
    const saveAs = FileSaver.saveAs;
    FileSaver.saveAs = () => {};
    const component = setup();
    await component.simulate('click');
    FileSaver.saveAs = saveAs;
    const { success, processing } = component.state();
    expect(success).toBe(true);
    expect(processing).toBe(false);
  });

  it('should toggle itself into error state', async () => {
    const saveAs = FileSaver.saveAs;
    const err = new Error('Test');
    FileSaver.saveAs = () => {
      throw err;
    };
    const component = setup();
    await component.simulate('click');
    FileSaver.saveAs = saveAs;
    const { success, processing, error } = component.state();
    expect(success).toBe(false);
    expect(processing).toBe(false);
    expect(error).toBe(err.toString());
  });

  afterEach(() => {
    if (spy) {
      spy.mockClear();
    }
  });
});
