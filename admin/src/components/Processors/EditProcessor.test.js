import React from 'react';
import { shallow, mount } from 'enzyme';

import { Form } from 'informed';
import EditProcessorForm, { EditProcessor } from './EditProcessor';

const setupShallow = propOverrides => {
  const props = Object.assign({}, propOverrides);
  const component = shallow(<EditProcessor {...props} />);
  const mount = shallow(<EditProcessor {...props} />);

  return { props, component, mount };
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
});
