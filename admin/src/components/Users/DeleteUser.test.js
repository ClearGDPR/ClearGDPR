import React from 'react';
import { shallow, mount } from 'enzyme';

import DeleteUser from './DeleteUser';

const setupShallow = propOverrides => {
  const props = Object.assign({ isOpen: true }, propOverrides);
  const component = shallow(<DeleteUser {...props} />);

  return { props, component };
};

const setupMount = propOverrides => {
  const props = Object.assign({ isOpen: true }, propOverrides);
  const component = mount(<DeleteUser {...props} />);

  return { props, component };
};

describe('(Component) Delete User', () => {
  it('should render correctly when closed', async () => {
    const { component } = setupShallow({ isOpen: false });
    expect(component).toMatchSnapshot();
  });

  it('should render correctly when open', async () => {
    const { component } = setupShallow({ isOpen: true });
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

  it('should call onCancel when Cancel button clicked', async () => {
    const onCancel = jest.fn();
    const { component } = setupMount({ onCancel });

    const button = component.find('button').at(0);
    button.simulate('click');
    expect(onCancel).toHaveBeenCalled();
  });

  it('should call onConfirm when Confirm button clicked', async () => {
    const onConfirm = jest.fn();
    const { component } = setupMount({ onConfirm });

    const button = component.find('button').at(1);
    button.simulate('click');
    expect(onConfirm).toHaveBeenCalled();
  });
});
