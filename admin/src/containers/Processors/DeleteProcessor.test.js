import React from 'react';
import { shallow } from 'enzyme';

import session from 'helpers/Session';
import * as TestUtils from 'tests/helpers/TestUtils';

import { DeleteProcessorContainer } from './DeleteProcessor';

jest.mock('helpers/Session');

const setupShallow = propOverrides => {
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
  session.getToken.mockReturnValue('token');
});

describe('(Container) Delete processor', () => {
  it('should render correctly when processor and default provided props provided', async () => {
    const { component } = setupShallow();
    expect(component).toMatchSnapshot();
  });

  it('should call delete processor from props when delete processor was called', async () => {
    const { props, component } = setupShallow();
    component.instance().deleteProcessor();
    expect(props.deleteProcessor).toHaveBeenCalledWith(1);
  });

  it('should call onClose when deleting processor is successful', async () => {
    const { props, component } = setupShallow();
    component.instance().deleteProcessor();
    await TestUtils.flushPromises();
    expect(props.onClose).toHaveBeenCalled();
  });
});
