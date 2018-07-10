import React from 'react';
import { shallow, mount } from 'enzyme';

import DeleteUser from './DeleteUser';

const setup = propOverrides => {
  const props = Object.assign(
    {
      isOpen: true,
      onConfirm: jest.fn(),
      onCancel: jest.fn()
    },
    propOverrides
  );
  const component = shallow(<DeleteUser {...props} />);
  const mounted = mount(<DeleteUser {...props} />);

  return { props, component, mounted };
};

describe('(Component) Delete User', () => {
  it('should render correctly when closed', async () => {
    const { component } = setup({ isOpen: false });
    expect(component).toMatchSnapshot();
  });

  it('should render correctly when open', async () => {
    const { component } = setup({ isOpen: true });
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

  it('should call onCancel when Cancel button clicked', async () => {
    const onCancel = jest.fn();
    const { mounted } = setup({ onCancel });

    const button = mounted.find('button').at(0);
    button.simulate('click');
    expect(onCancel).toHaveBeenCalled();
  });

  it('should call onConfirm when Confirm button clicked', async () => {
    const onConfirm = jest.fn();
    const { mounted } = setup({ onConfirm });

    const button = mounted.find('button').at(1);
    button.simulate('click');
    expect(onConfirm).toHaveBeenCalled();
  });
});
