import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Login from 'containers/Login/Login';
import MainLayout from 'containers/MainLayout/MainLayout';
import KitchenSink from 'components/core/pages/Dashboard';
import NoMatch from 'components/NoMatch';
import PrivateRoute from 'helpers/routing/PrivateRoute';

export default () => (
  <Router>
    <Switch>
      <Route path="/login" component={Login} exact />

      <PrivateRoute path="/" component={MainLayout} exact />
      <PrivateRoute path="/processors" component={MainLayout} exact />
      <PrivateRoute path="/users" component={MainLayout} exact />
      <PrivateRoute path="/rectifications" component={MainLayout} exact />
      <PrivateRoute path="/profile" component={MainLayout} exact />
      <PrivateRoute path="/blockchain-events" component={MainLayout} exact />

      <Route path="/kitchen-sink" component={KitchenSink} exact />
      <Route path="/kitchen-sink/overview" component={KitchenSink} exact />
      <Route path="/kitchen-sink/processors" component={KitchenSink} exact />
      <Route path="/kitchen-sink/loader" component={KitchenSink} exact />

      <Route component={NoMatch} />
    </Switch>
  </Router>
);
