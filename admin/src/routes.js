import React from 'react';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
// import App from './containers/App';
import Login from './containers/Login/Login';
import Dashboard from './components/core/pages/Dashboard';
import NoMatch from './components/NoMatch';
import PrivateRoute from './helpers/routing/PrivateRoute';

export default () => (
  <Router>
    <Switch>
      <Route path="/login" component={Login} exact />
      <PrivateRoute path="/" component={Dashboard} exact />
      <Route component={NoMatch} />
    </Switch>
  </Router>
);
