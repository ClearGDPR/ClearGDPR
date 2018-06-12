import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';

// import App from './containers/App';
import Login from './containers/Login/Login';
import NoMatch from './components/NoMatch';
import history from './history';

export default () => (
  <Router history={history}>
    <Switch>
      <Route path="/login" component={Login} exact />
      <Route component={NoMatch} />
    </Switch>
  </Router>
);
