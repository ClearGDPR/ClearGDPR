import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import { PanelConsumer } from './PanelContext';

import session from 'helpers/Session';

import MainLayout from 'components/MainLayout/MainLayout';

import UsersContainer from 'containers/Users/Users';
import ProcessorsContainer from 'containers/Processors/Processors';
import Rectifications from 'containers/Rectifications/Rectifications';
import DashboardContainer from 'containers/Dashboard/Dashboard';
import BlockchainEvents from 'containers/BlockchainEvents/BlockchainEvents';

import { withContextProviders } from 'helpers/wrappers';

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
            onMenuClick={this.toggleSidenav}
            onOverlayClick={closePanel}
            onClosePanelClick={closePanel}
            panelContent={Component ? <Component {...props} /> : null}
            panelTitle={panelTitle}
            content={
              <Switch>
                <Route exact path="/" render={() => <DashboardContainer />} />
                <Route exact path="/processors" render={() => <ProcessorsContainer />} />
                <Route exact path="/users" render={() => <UsersContainer />} />
                <Route exact path="/blockchain-events" render={() => <BlockchainEvents />} />
                <Route exact path="/rectifications" render={() => <Rectifications />} />
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

export default withContextProviders(MainLayoutContainer);
