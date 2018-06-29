import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import lodash from 'lodash';

import { PanelProvider, PanelConsumer } from './PanelContext';

import session from 'helpers/Session';

import MainLayout from 'components/MainLayout/MainLayout';

import UsersContainer from 'containers/Users/Users';
import ProcessorsContainer from 'containers/Processors/Processors';
import { UsersProvider } from 'containers/Users/UsersContext';

class MainLayoutContainer extends Component {
  state = {
    isSidenavOpen: true,
    isPanelOpen: false
  };

  constructor() {
    super();

    // set an eventListener on the browser's resize event if you want this to be dynamic
    if (window.innerWidth < 840) {
      this.mobileDashboard();
    }
  }

  mobileDashboard = () => {
    this.setState({
      isSidenavOpen: false
    });
  };

  toggleSidenav = () => {
    this.setState(prevState => ({
      isSidenavOpen: !prevState.isSidenavOpen
    }));
  };

  render() {
    return (
      <PanelConsumer>
        {({ component: Component, title: panelTitle, props, closePanel, isPanelOpen }) => (
          <MainLayout
            isSidenavOpen={this.state.isSidenavOpen}
            isPanelOpen={isPanelOpen}
            username={session.getUsername()}
            onMenuClick={this.toggleSidenav.bind(this)}
            onOverlayClick={closePanel}
            onClosePanelClick={closePanel}
            panelContent={Component ? <Component {...props} /> : null}
            panelTitle={panelTitle}
            content={
              <Switch>
                <Route exact path="/" render={() => <React.Fragment>Dashboard</React.Fragment>} />
                <Route exact path="/processors" render={() => <ProcessorsContainer />} />
                <Route exact path="/users" render={() => <UsersContainer />} />
                <Route
                  exact
                  path="/profile"
                  render={() => <React.Fragment>Profile</React.Fragment>}
                />
              </Switch>
            }
          />
        )}
      </PanelConsumer>
    );
  }
}

const withProvider = ContextProvider => Component => {
  let wrapper = props => (
    <ContextProvider>
      <Component {...props}>{props.children}</Component>
    </ContextProvider>
  );
  wrapper.propTypes = {
    children: PropTypes.node
  };
  return wrapper;
};

const withProviders = lodash.flow.apply(null, [
  withProvider(UsersProvider),
  withProvider(PanelProvider)
]);

export default withProviders(MainLayoutContainer);
