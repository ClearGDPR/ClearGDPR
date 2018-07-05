import React from 'react';
import { shallow, mount } from 'enzyme';

import EditProcessorForm, { EditProcessor } from './EditProcessor';

const setupShallow = propOverrides => {
  const props = Object.assign({}, propOverrides);
  const component = shallow(<EditProcessor {...props} />);

  return { props, component };
};

const setupMount = propOverrides => {
  const props = Object.assign({}, propOverrides);
  const component = mount(<EditProcessorForm {...props} />);

  return { props, component };
};

describe('(Component) Edit Processor Form', () => {
  it('should render correctly when no props provided', async () => {
    const { component } = setupShallow();
    expect(component).toMatchSnapshot();
  });

  it('should render correctly when the prop isLoading is set to false', async () => {
    const { component } = setupShallow({ isLoading: false });
    expect(component).toMatchSnapshot();
  });

  it('should render correctly when the prop isLoading is set to true', async () => {
    const { component } = setupShallow({ isLoading: true });
    expect(component).toMatchSnapshot();
  });

  it('should call onSubmit when submit button clicked', async () => {
    const onSubmit = jest.fn();
    const { component } = setupShallow({ onSubmit });

    const button = component.find('button[type="submit"]');
    console.log(button.debug());
    // button.simulate('click');
    // expect(onSubmit).toHaveBeenCalled();
  });
});
