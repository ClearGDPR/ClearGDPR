import { shallow } from 'enzyme/build/index';
import React from 'react';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import ConsentSuccess from './ConsentSuccess';

const setup = async () => {
  return shallow(
    <Router history={createBrowserHistory()}>
      <ConsentSuccess />
    </Router>
  );
};

describe('(Elements) Consent', () => {
  it('should render correctly', async () => {
    const element = await setup();
    expect(element).toMatchSnapshot();
  });
});
