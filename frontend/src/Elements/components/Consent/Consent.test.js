import React from 'react';
import { shallow } from 'enzyme';
import Consent from './Consent';

const processors = [
  {
    name: 'Nielsen',
    logoUrl: '',
    consented: 72,
    description: '',
    scopes: ['Full Name', 'Email', 'Phone Number']
  },
  {
    name: 'Live Ramp',
    logoUrl: '',
    consented: 64,
    description: '',
    scopes: ['Email']
  },
  {
    name: 'Experian',
    logoUrl: '',
    consented: 25,
    description: '',
    scopes: ['Full Name', 'Phone Number']
  }
];

const setup = propOverrides => {
  const props = {
    processors,
    ...propOverrides
  };

  const component = shallow(<Consent {...props} />);

  return { props, component };
};

describe('(Elements) Consent', () => {
  beforeAll(() => {
    window.cg = {
      Subject: {
        giveConsent: () => {},
        getProcessors: () => {}
      }
    };
  });

  it('should render correctly', () => {});
});
