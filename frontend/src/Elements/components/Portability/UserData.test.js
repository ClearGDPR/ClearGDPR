import { CG } from '@cleargdpr/js-sdk';
import { shallow } from 'enzyme/build/index';
import React from 'react';
import UserData from './UserData';
import Subject from '../../contexts/Subject';

const processors = [
  {
    id: 1,
    name: 'Nielsen',
    logoUrl: '',
    consented: 72,
    description: '',
    scopes: ['Full Name', 'Email', 'Phone Number']
  },
  {
    id: 2,
    name: 'Live Ramp',
    logoUrl: '',
    consented: 64,
    description: '',
    scopes: ['Email']
  },
  {
    id: 3,
    name: 'Experian',
    logoUrl: '',
    consented: 25,
    description: '',
    scopes: ['Full Name', 'Phone Number']
  }
];

const cg = new CG({
  apiKey: 'test',
  apiUrl: 'test'
});
cg.Subject.getProcessors = async () => {
  return processors;
};

const setup = async () => {
  return shallow(
    <UserData
      {...{
        subject: new Subject(cg, {
          data: { name: 'John', email: 'john@gmail.com' },
          status: 1,
          propagateMutation: () => {}
        })
      }}
    />
  );
};

describe('UserData', () => {
  it('should render correctly', async () => {
    const element = await setup();
    expect(element).toMatchSnapshot();
  });
});
