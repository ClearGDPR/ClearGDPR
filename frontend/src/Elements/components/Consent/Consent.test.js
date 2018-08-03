import React from 'react';
import { mount } from 'enzyme';
import Consent from './Consent';
import PopoverView from '../Common/Views/Popover';
import Checkbox from '../Common/Checkbox';
import ProcessorsList from '../Processors/ProcessorsList';
import { CG } from '../../../js-sdk';

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
  return mount(<Consent {...{ options: defaultOptions, cg }} />);
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
      <Consent {...{ options: defaultOptions, cg }} />
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

  it('should subscribe itself to parent forms "onSubmit" event', async () => {
    const form = await setupIntoForm();
    spy = jest.spyOn(cg.Events, 'subscribe');

    const event = new Event('submit');
    form.getDOMNode().dispatchEvent(event);

    expect(spy).toHaveBeenCalledWith('auth.setAccessToken', expect.any(Function));
  });

  it('should give consent to all enabled processors', async () => {
    const form = await setupIntoForm();

    spy = jest.spyOn(cg.Subject, 'giveConsent');

    const event = new Event('submit');
    form.getDOMNode().dispatchEvent(event);
    cg.setAccessToken('token');

    expect(spy).toHaveBeenCalledWith({
      personalData: { email: 'email@gmail.com', name: 'John', test: 'two' },
      processors: [1, 2, 3]
    });
  });

  it('should disable form submit event listeners after unmount', async () => {
    const form = await setupIntoForm();

    spy = jest.spyOn(form.getDOMNode(), 'removeEventListener');
    form.unmount();

    expect(spy).toHaveBeenCalledWith('submit', expect.any(Function));
  });

  it('should disable `auth.setAccessToken` after unmount', async () => {
    const form = await setupIntoForm();

    spy = jest.spyOn(cg.Events, 'clear');
    form.unmount();

    expect(spy).toHaveBeenCalledWith('auth.setAccessToken');
  });

  afterEach(() => {
    if (spy) {
      spy.mockClear();
    }
  });
});
