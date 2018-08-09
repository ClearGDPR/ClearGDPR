import React from 'react';
import { mount } from 'enzyme';
import Restriction from './Restriction';
import { CG } from '../../../js-sdk';
import Switch from '../Common/Switch';

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

const setup = () => mount(<Restriction {...{ options: {}, cg }} />);

let spy;

describe('(Elements SDK) Restriction', () => {
  beforeEach(() => {
    spy = null;
  });

  it('should render correctly', () => {
    const component = setup();
    expect(component).toMatchSnapshot();
  });

  it('should call `getRestrictions` method to retrieve current status', async () => {
    spy = jest.spyOn(cg.Subject, 'getRestrictions');
    setup();
    expect(spy).toHaveBeenCalled();
  });

  it('state should be equal to restrictions status', async () => {
    const component = await setup();
    const { restrictions } = component.state();
    expect(restrictions).toEqual(restrictionsStub);
  });

  it('should call `updateRestrictions` when subject toggles switch', async () => {
    spy = jest.spyOn(cg.Subject, 'updateRestrictions');
    const component = await setup();
    component.update();
    component.find(Switch).at(0).simulate('click');
    component.find(Switch).at(1).simulate('click');
    component.find(Switch).at(2).simulate('click');
    expect(component.state().restrictions).toEqual({
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
