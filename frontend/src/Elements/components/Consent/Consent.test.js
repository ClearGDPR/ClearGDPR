import React from 'react';
import { mount } from 'enzyme';
import Consent from './Consent';
import PopoverView from 'components/Common/Views/Popover';
import Checkbox from 'components/Common/Checkbox';
import ProcessorsList from 'components/Processors/ProcessorsList';
import { CG } from '@cleargdpr/js-sdk';
import Subject from 'contexts/Subject';

const processors = [
  {
    id: 1,
    name: 'Nielsen',
    logoUrl: '',
    consented: 72,
    description: '',
    scopes: ['Full Name', 'Email', 'Phone Number']
  },
  {
    id: 2,
    name: 'Live Ramp',
    logoUrl: '',
    consented: 64,
    description: '',
    scopes: ['Email']
  },
  {
    id: 3,
    name: 'Experian',
    logoUrl: '',
    consented: 25,
    description: '',
    scopes: ['Full Name', 'Phone Number']
  }
];

const cg = new CG({
  apiKey: 'test',
  apiUrl: 'test'
});
cg.Subject.giveConsent = async () => {};
cg.Subject.getProcessors = async () => {
  return processors;
};

const subject = new Subject(cg, { propagateMutation: () => {} });

const defaultOptions = {
  label: `Test label`,
  styles: {
    label: {
      fontSize: '12px'
    }
  },
  required: true,
  onSuccessCallback: () => {}
};

const setup = async () => {
  return mount(<Consent options={defaultOptions} subject={subject} />);
};

const setupIntoForm = async () => {
  const Form = (
    <form>
      <input name="name" defaultValue="John" data-cleargdpr="true" />
      <input name="email" defaultValue="email@gmail.com" data-cleargdpr="true" />
      <select name="test" defaultValue="two" data-cleargdpr="true">
        <option value="one">one</option>
        <option value="two">two</option>
      </select>
      <Consent options={defaultOptions} subject={subject} />
    </form>
  );

  return mount(Form);
};

let spy;

describe('(Elements) Consent', () => {
  it('should render correctly', async () => {
    const element = await setup();
    expect(element).toMatchSnapshot();
  });

  it('should get processors list and use it for rendering', async () => {
    const element = await setup();
    expect(element.state().processors).toHaveLength(processors.length);
  });

  it('should open popover', async () => {
    const element = await setup();
    element.find('button').simulate('click');
    expect(element.find(PopoverView)).toHaveLength(1);
  });

  it('should pass some options down to checkbox component', async () => {
    const element = await setup();
    const props = element.find(Checkbox).props();
    expect(props.required).toBe(defaultOptions.required);
    expect(props.label).toBe(defaultOptions.label);
    expect(props.styles).toBe(defaultOptions.styles);
  });

  it('should listen to "onProcessorChange" event and update processors list', async () => {
    const element = await setup();
    element.find('button').simulate('click');
    const processorsList = element.find(ProcessorsList);
    expect(element.state().processors[0].enabled).toBe(true);
    processorsList.props().onProcessorChange({ ...processors[0], enabled: false });
    expect(element.state().processors[0].enabled).toBe(false);
  });

  test.skip('should give consent to all enabled processors', async () => {
    const form = await setupIntoForm();

    spy = jest.spyOn(cg.Subject, 'giveConsent');
    //make subject authenticate
    subject.isGuest = false;
    form.find(Consent).setProps({});

    expect(spy).toHaveBeenCalledWith({
      personalData: { email: 'email@gmail.com', name: 'John', test: 'two' },
      processors: [1, 2, 3]
    });
  });

  afterEach(() => {
    if (spy) {
      spy.mockClear();
    }
  });
});
