import React from 'react';
import { mount } from 'enzyme';
import Objection from './Objection';
import { CG } from '@cleargdpr/js-sdk';
import Switch from '../Common/Switch';
import Subject from '../../contexts/Subject';

const cg = new CG({
  apiKey: 'test',
  apiUrl: 'test'
});
cg.Subject.getObjectionStatus = async () => ({ objection: true });
cg.Subject.updateObjection = async () => {};

const subject = new Subject(cg, { propagateMutation: () => {} });

const setup = async () => mount(<Objection {...{ options: {}, subject }} />);

let spy;

describe('Objection', () => {
  beforeEach(() => {
    spy = null;
  });
  it('should render correctly', () => {
    const component = setup();
    expect(component).toMatchSnapshot();
  });

  it('should call `fetchObjectionStatus` method to retrieve current status', async () => {
    spy = jest.spyOn(subject, 'fetchObjectionStatus');
    setup();
    expect(spy).toHaveBeenCalled();
  });

  it('should call `updateObjection` when subject toggles switch', async () => {
    spy = jest.spyOn(subject, 'updateObjection');
    const component = await setup();
    component.find(Switch).simulate('click');
    expect(spy).toHaveBeenCalledWith(false);
  });

  it('debounce switch toggles', async () => {
    spy = jest.spyOn(cg.Subject, 'updateObjection');
    const component = await setup();
    const switchComponent = component.find(Switch);
    switchComponent.simulate('click');
    switchComponent.simulate('click');
    expect(spy).toHaveBeenCalledTimes(1);
  });

  afterEach(() => {
    if (spy) {
      spy.mockClear();
    }
  });
});
