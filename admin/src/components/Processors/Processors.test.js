import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import Processors from './Processors';
import * as ProcessorsDataFactory from 'tests/data/processors.factory';

const setup = propOverrides => {
  const props = Object.assign({
    processors: ProcessorsDataFactory.getAll(),
    isLoading: false,
    onEditProcessorClick: jest.fn(),
    onCreateProcessorClick: jest.fn(),
    onDeleteProcessorClick: jest.fn(),
  }, propOverrides);

  const component = shallow(<Processors {...props} />);

  return { props, component };
};

describe('(Component) Processors', () => {
  it('should render when not loading correctly', () => {
    const { component } = setup();
    expect(toJson(component)).toMatchSnapshot();
  });

  it('should render when loading correctly', () => {
    const { component } = setup({ isLoading: true });
    expect(toJson(component)).toMatchSnapshot();
  });
});
