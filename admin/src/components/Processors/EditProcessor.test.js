import React from 'react';
import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import EditProcessorForm, { EditProcessor } from './EditProcessor';

const setup = propOverrides => {
  const props = Object.assign({}, propOverrides);
  const component = shallow(<EditProcessor {...props} />);

  return { props, component, mount };
};

const setupForm = propOverrides => {
  let formApi;
  const props = Object.assign({}, propOverrides);
  const component = mount(
    <EditProcessorForm
      {...props}
      getApi={api => {
        formApi = api;
      }}
    />
  );

  return { formApi, props, component };
};


describe('(Component) Edit Processor Form', () => {
  it('should render correctly when no props provided', async () => {
    const { component } = setup();
    expect(toJson(component)).toMatchSnapshot();
  });

  it('should render correctly when the prop isLoading is set to false', async () => {
    const { component } = setup({ isLoading: false });
    expect(toJson(component)).toMatchSnapshot();
  });

  it('should render correctly when the prop isLoading is set to true', async () => {
    const { component } = setup({ isLoading: true });
    expect(toJson(component)).toMatchSnapshot();
  });
});
