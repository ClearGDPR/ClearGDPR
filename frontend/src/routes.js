import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';

import App from './containers/App';
import Login from './containers/Login';
import SignUp from './containers/SignUp';
import Profile from './containers/Profile';
import Share from './containers/Share';
import { ConsentSuccess } from '@cleargdpr/elements';

import NoMatch from './components/NoMatch';

import history from './history';

export default () => (
  <Router history={history}>
    <React.Fragment>
      <Switch>
        <Route path="/success" component={ConsentSuccess} />
        <App>
          <Switch>
            <Route path="/" component={SignUp} exact />
            <Route path="/sign-up" component={SignUp} exact />
            <Route path="/login" component={Login} exact />
            <Route path="/profile" component={Profile} exact />
            <Route path="/shares" component={Share} exact />
            <Route component={NoMatch} />
          </Switch>
        </App>
      </Switch>
    </React.Fragment>
  </Router>
);
