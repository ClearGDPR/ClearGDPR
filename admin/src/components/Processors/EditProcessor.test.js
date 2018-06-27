import React from 'react';
import { shallow, mount } from 'enzyme';

import EditProcessorForm, { EditProcessor } from './EditProcessor';

const setup = propOverrides => {
  const props = Object.assign({}, propOverrides);
  const component = shallow(<EditProcessor {...props} />);
  const mountedComponent = mount(<EditProcessorForm {...props} />);

  return {
    props,
    component,
    mountedComponent
  };
};

describe('(Component) Edit Processor form', () => {
  it('should render correctly when no props provided', async () => {
    const { component } = setup();
    expect(component).toMatchSnapshot();
  });

  it('should render correctly when the prop isLoading is set to false', async () => {
    const { component } = setup({ isLoading: false });
    expect(component).toMatchSnapshot();
  });

  it('should render correctly when the prop isLoading is set to true', async () => {
    const { component } = setup({ isLoading: true });
    expect(component).toMatchSnapshot();
  });

  it('should call onSubmit when submit button clicked', async () => {
    const onSubmit = jest.fn();
    const { component } = setup({ onSubmit });

    // TODO: validation on fields should be triggered
    const form = component.find('form').at(0);
    form.simulate('submit');
    expect(onSubmit).toHaveBeenCalled();
  });
});
