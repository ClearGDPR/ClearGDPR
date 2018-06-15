import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import MainLayout from '../../components/MainLayout/MainLayout';

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

  togglePanel = () => {
    this.setState(prevState => ({
      isPanelOpen: !prevState.isPanelOpen
    }));
  };

  closePanel = () => {
    this.setState({
      isPanelOpen: false
    });
  };

  render() {
    return (
      <MainLayout
        isSidenavOpen={this.state.isSidenavOpen}
        isPanelOpen={this.state.isPanelOpen}
        username="admin"
        onMenuClick={this.toggleSidenav.bind(this)}
        onOverlayClick={this.closePanel.bind(this)}
        onClosePanelClick={this.closePanel.bind(this)}
        content={
          <Switch>
            <Route exact path="/" render={() => <React.Fragment>Dashboard</React.Fragment>} />
            <Route
              exact
              path="/processors"
              render={() => <React.Fragment>Processors</React.Fragment>}
            />
            <Route exact path="/users" render={() => <React.Fragment>Users</React.Fragment>} />
            <Route exact path="/profile" render={() => <React.Fragment>Profile</React.Fragment>} />
          </Switch>
        }
      />
    );
  }
}

export default MainLayoutContainer;
