import React from 'react';
import { CG } from '@cleargdpr/js-sdk';
import { mount } from 'enzyme';
import ForgottenRequest from './ForgottenRequest';
import ModalView from '../Common/Views/Modal';
import Subject from '../../contexts/Subject';

const cg = new CG({
  apiKey: 'test',
  apiUrl: 'test'
});
cg.Subject.eraseData = async () => {};

const subject = new Subject(cg, {
  status: 1,
  data: {},
  initNewSession: () => {}
});

const setup = () => mount(<ForgottenRequest {...{ options: { label: 'Erase' }, subject }} />);

let spy;

describe('ForgottenRequest', () => {
  it('should render correctly', () => {
    const component = setup();
    expect(component).toMatchSnapshot();
  });

  it('should open confirmation modal before erase', async () => {
    const component = setup();
    expect(component.find(ModalView).props().open).toBe(false);
    component.find('button').simulate('click');
    expect(component.find(ModalView).props().open).toBe(true);
  });

  it('should execute `eraseData` after confirmation and sets `processing` state attribute to true', async () => {
    const component = setup();
    component.find('button').simulate('click');
    spy = jest.spyOn(subject, 'eraseData');

    component
      .find(ModalView)
      .find('button.is-primary')
      .simulate('click');

    expect(spy).toHaveBeenCalled();
  });

  afterEach(() => {
    if (spy) {
      spy.mockClear();
    }
  });
});
