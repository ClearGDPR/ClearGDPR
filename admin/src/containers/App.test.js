import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import localStorage from 'node-localstorage';

it('renders without crashing', () => {
  global.localStorage = new localStorage.LocalStorage('');
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});
