import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';

// import App from './containers/App';
import Login from './containers/Login/Login';
import Dashboard from './components/core/pages/Dashboard';
import NoMatch from './components/NoMatch';
import history from './history';

export default () => (
  <Router history={history}>
    <Switch>
      <Route path="/login" component={Login} exact />
      <Route path="/dashboard" component={Dashboard} />
      <Route component={NoMatch} />
    </Switch>
  </Router>
);
