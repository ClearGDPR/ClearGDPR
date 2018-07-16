import React from 'react';
import { shallow } from 'enzyme';

import * as TestUtils from 'tests/helpers/TestUtils';

import { DeleteProcessorContainer } from './DeleteProcessor';

const setup = propOverrides => {
  const props = Object.assign(
    {
      processorId: 1,
      deleteProcessor: jest.fn().mockReturnValue(Promise.resolve()),
      onClose: jest.fn(),
      isOpen: true,
      isLoading: false
    },
    propOverrides
  );
  const component = shallow(<DeleteProcessorContainer {...props} />);

  return { props, component };
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('(Container) Delete processor', () => {
  it('should render correctly when processor and default provided props provided', async () => {
    const { component } = setup();
    expect(component).toMatchSnapshot();
  });

  it('should call delete processor from props when delete processor was called', async () => {
    const { props, component } = setup();
    component.instance().deleteProcessor();
    expect(props.deleteProcessor).toHaveBeenCalledWith(1);
  });

  it('should call onClose when deleting processor is successful', async () => {
    const { props, component } = setup();
    component.instance().deleteProcessor();
    await TestUtils.flushPromises();
    expect(props.onClose).toHaveBeenCalled();
  });

  it('should call onClose when deleting processor is unsuccessful', async () => {
    const { props, component } = setup({
      deleteProcessor: jest.fn().mockReturnValue(Promise.reject('Some error!'))
    });
    await component.instance().deleteProcessor();
    await TestUtils.flushPromises();
    expect(props.onClose).toHaveBeenCalled();
  });
});
