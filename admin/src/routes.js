import React from 'react';
import { Component } from 'react';
import PropTypes from 'prop-types';

import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';

// import App from './containers/App';
import Login from './containers/Login/Login';
import Dashboard from './components/core/pages/Dashboard';
import NoMatch from './components/NoMatch';
import history from './history';

import session from './helpers/Session';

export default () => (
  <Router history={history}>
    <Switch>
      <Route path="/login" component={Login} exact />
      <PrivateRoute path="/dashboard" component={Dashboard} />
      <Route component={NoMatch} />
    </Switch>
  </Router>
);

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      session.isLoggedIn() ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: '/login',
            state: { from: props.location }
          }}
        />
      )
    }
  />
);

PrivateRoute.propTypes = {
  component: PropTypes.instanceOf(Component)
};
