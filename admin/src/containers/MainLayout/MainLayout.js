import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import MainLayout from '../../components/MainLayout/MainLayout';

import { PanelProvider, PanelConsumer } from './PanelContext';

import UsersContainer from '../Users/Users';
import ProcessorsContainer from '../Processors/Processors';

class MainLayoutContainer extends Component {
  state = {
    isSidenavOpen: true,
    isPanelOpen: false
  };

  componentWillMount() {
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
      <PanelProvider>
        <PanelConsumer>
          {({ component: Component, title: panelTitle, props, closePanel, isPanelOpen }) => (
            <MainLayout
              isSidenavOpen={this.state.isSidenavOpen}
              isPanelOpen={isPanelOpen}
              username="admin"
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
      </PanelProvider>
    );
  }
}

export default MainLayoutContainer;
