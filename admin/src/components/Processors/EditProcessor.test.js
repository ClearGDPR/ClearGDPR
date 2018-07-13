import React from 'react';
import { shallow, mount } from 'enzyme';
import { EditProcessor } from './EditProcessor';

const setup = propOverrides => {
  const props = Object.assign({}, propOverrides);
  const component = shallow(<EditProcessor {...props} />);

  return { props, component, mount };
};

describe('(Component) Edit Processor Form', () => {
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
});
