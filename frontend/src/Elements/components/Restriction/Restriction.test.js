import React from 'react';
import { mount } from 'enzyme';
import Restriction from './Restriction';
import { CG } from '@cleargdpr/js-sdk';
import Switch from 'components/Common/Switch';
import Subject from 'contexts/Subject';

const restrictionsStub = {
  directMarketing: true,
  emailCommunication: false,
  research: false
};

const cg = new CG({
  apiKey: 'test',
  apiUrl: 'test'
});
cg.Subject.getRestrictions = async () => restrictionsStub;
cg.Subject.updateRestrictions = async () => {};

const subject = new Subject(cg, { propagateMutation: () => {} });

const setup = () => mount(<Restriction {...{ options: {}, subject }} />);

let spy;

describe('(Elements SDK) Restriction', () => {
  beforeEach(() => {
    spy = null;
  });

  it('should render correctly', () => {
    const component = setup();
    expect(component).toMatchSnapshot();
  });

  it('should call `fetchRestrictions` method to retrieve current status', async () => {
    spy = jest.spyOn(subject, 'fetchRestrictions');
    setup();
    expect(spy).toHaveBeenCalled();
  });

  it('should call `updateRestrictions` when subject toggles switch', async () => {
    spy = jest.spyOn(subject, 'updateRestrictions');
    const component = await setup();
    component.update();
    component
      .find(Switch)
      .at(0)
      .simulate('click');
    component
      .find(Switch)
      .at(1)
      .simulate('click');
    component
      .find(Switch)
      .at(2)
      .simulate('click');
    expect(subject.restrictions).toEqual({
      directMarketing: false,
      emailCommunication: true,
      research: true
    });
    expect(spy).toHaveBeenCalledTimes(3);
  });

  afterEach(() => {
    if (spy) {
      spy.mockClear();
    }
  });
});
