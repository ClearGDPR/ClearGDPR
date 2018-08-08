import React from 'react';
import { mount } from 'enzyme';
import Objection from './Objection';
import { CG } from '../../../js-sdk';
import Switch from '../Common/Switch';

const cg = new CG({
  apiKey: 'test',
  apiUrl: 'test'
});
cg.Subject.getObjectionStatus = async () => ({ objection: true });
cg.Subject.updateObjection = async () => {};

const setup = () => mount(<Objection {...{ options: {}, cg }} />);

let spy;

describe('Objection', () => {
  beforeEach(() => {
    spy = null;
  });
  it('should render correctly', () => {
    const component = setup();
    expect(component).toMatchSnapshot();
  });

  it('should call `getObjectionStatus` method to retrieve current status', async () => {
    spy = jest.spyOn(cg.Subject, 'getObjectionStatus');
    setup();
    expect(spy).toHaveBeenCalled();
  });

  it('aligns state with received objection status', async () => {
    const component = await setup();
    const { allowDataProcessing, busy } = component.state();
    expect(allowDataProcessing).toBe(false);
    expect(busy).toBe(false);
  });

  it('should call `updateObjection` when subject toggles switch', async () => {
    spy = jest.spyOn(cg.Subject, 'updateObjection');
    const component = await setup();
    component.find(Switch).simulate('click');
    expect(component.state().allowDataProcessing).toBe(true);
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
