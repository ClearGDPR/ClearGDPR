import React from 'react';
import { shallow } from 'enzyme';
import ConsentDial from './ConsentDial';

describe('(Component) ConsentDial', () => {
  it('should render', () => {
    const props = {
      data: {
        consented: 1,
        unconsented: 10
      }
    };
    const component = shallow(<ConsentDial {...props} />);
    expect(component).toMatchSnapshot();
  });

  it('should render if numbers are 0', () => {
    const props = {
      data: {
        consented: 0,
        unconsented: 0
      }
    };
    const component = shallow(<ConsentDial {...props} />);
    expect(component).toMatchSnapshot();
  });
});
