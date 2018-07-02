import React from 'react';
import { shallow } from 'enzyme';

import { EditProcessor } from './EditProcessor';

const setupShallow = propOverrides => {
  const props = Object.assign({}, propOverrides);
  const component = shallow(<EditProcessor {...props} />);

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

    const form = component.find('form').at(0);
    form.simulate('submit');
    expect(onSubmit).toHaveBeenCalled();
  });
});
