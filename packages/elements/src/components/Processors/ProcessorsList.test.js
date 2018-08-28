import React from 'react';
import ProcessorsList from './ProcessorsList';
import Processor from './Processor';
import { shallow } from 'enzyme/build/index';

const PROCESSORS = [];

for (let i = 0; i < 5; i++) {
  PROCESSORS.push({
    id: i,
    enabled: true,
    name: `Test-${i}`,
    logoUrl: 'http://logo.com/test.png',
    description: `This is a test processor ${1}`,
    scopes: ['email', 'name'],
    purposes: ['communication', 'advertising']
  });
}

const setup = props => {
  return shallow(
    <ProcessorsList {...Object.assign({ onProcessorChange: () => {}, processors: [] }, props)} />
  );
};

describe('Processors list', () => {
  it('should render correctly', () => {
    const component = setup();
    expect(component.text()).toBe('No processors');
  });

  it('should list all processors', () => {
    const component = setup({ processors: PROCESSORS });
    expect(component.find(Processor)).toHaveLength(PROCESSORS.length);
  });

  it('should execute callback', () => {
    const callback = jest.fn();
    const component = setup({ onProcessorChange: callback, processors: PROCESSORS });
    component
      .find(Processor)
      .first()
      .simulate('processorChange');
    expect(callback).toBeCalled();
  });
});
