import React from 'react';
import { shallow } from 'enzyme';
import Processor from './Processor';
import Switch from 'components/Common/Switch';

const PROCESSOR = {
  enabled: true,
  name: 'Test',
  logoUrl: 'http://logo.com/test.png',
  description: 'This is a test processor',
  scopes: ['email', 'name'],
  purposes: ['communication', 'advertising']
};

const setup = props => {
  return shallow(
    <Processor {...Object.assign({ onProcessorChange: () => {}, processor: PROCESSOR }, props)} />
  );
};

describe('Processor', () => {
  it('should render correctly', () => {
    const component = setup();
    expect(component).toMatchSnapshot();
  });

  it('should execute callback', () => {
    const callback = jest.fn();
    const component = setup({ onProcessorChange: callback });
    component
      .find(Switch)
      .first()
      .simulate('change');
    expect(callback).toBeCalled();
  });
});
