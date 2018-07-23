import React from 'react';
import { shallow } from 'enzyme';
import Consent from './Consent';

const processors = [

];

const setup = propOverrides => {
  const props = {
    processors
  };
  
  const component = shallow(<Consent {...props} />);

  return { props, component };
}

describe('(Elements) Consent', () => {
  it('should do the math correctly', () => {
  });
});
