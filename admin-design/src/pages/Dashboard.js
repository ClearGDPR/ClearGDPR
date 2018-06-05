import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import Sidenav from './../components/dashboard/Sidenav';
import Header from './../components/dashboard/Header';
import Overview from './../components/dashboard/Overview';
import Processors from './../components/dashboard/Processors';
import Panel from './../components/dashboard/Panel';
import Loader from './../components/dashboard/Loader';
import './dashboard.css';

class Dashboard extends Component {
  state = {
    isSidenavOpen: true,
    isPanelOpen: false,
    error: false,
    panelData: { title: 'Details' }
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
      <main className="dashboard">
        {this.state.isPanelOpen ? (
          <section className="overlay" onClick={this.togglePanel} />
        ) : null}
        <Sidenav isSidenavOpen={this.state.isSidenavOpen} />
        <section className="content">
          <Header
            toggleSidenav={this.toggleSidenav}
            title="GDPR Advanced Tools"
            greeting="Welcome, Admin"
          />
          <Switch>
            <Route
              exact
              path="/dashboard/overview"
              render={() => (
                <Overview
                  title="Overview"
                  desc="This is an overview of all the processed data."
                  togglePanel={this.togglePanel}
                  closePanel={this.closePanel}
                />
              )}
            />
            <Route
              exact
              path="/dashboard/processors"
              render={() => (
                <Processors
                  title="Processors"
                  desc="This is an overview of all the current data processors."
                  togglePanel={this.togglePanel}
                  closePanel={this.closePanel}
                />
              )}
            />
            <Route
              exact
              path="/dashboard/preferences"
              render={() => <Loader />}
            />
          </Switch>
          <Panel
            isPanelOpen={this.state.isPanelOpen}
            closePanel={this.closePanel}
            data={this.state.panelData}
          />
        </section>
      </main>
    );
  }
}

export default Dashboard;
