import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import Sidenav from 'components/core/cards/dashboard/Sidenav';
import Header from 'components/core/cards/dashboard/Header';
import Overview from 'components/core/cards/dashboard/Overview';
import Processors from 'components/core/cards/dashboard/Processors';
import Panel from 'components/core/cards/dashboard/Panel';
import Loader from 'components/core/cards/dashboard/Loader';
import Form from 'components/core/cards/dashboard/Form';
import './dashboard.css';

import * as ProcessorsDataFactory from 'tests/data/processors.factory';

export const processors = ProcessorsDataFactory.getAll();

export const users = [
  {
    title: 'Active Users',
    number: 12.676,
    change: 14
  },
  {
    title: 'Erased Users',
    number: 1.164,
    change: -10
  }
];

class Dashboard extends Component {
  state = {
    isSidenavOpen: true,
    isPanelOpen: true,
    error: false,
    panelData: { title: 'Details' }
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
        {this.state.isPanelOpen ? <section className="overlay" onClick={this.togglePanel} /> : null}
        <Sidenav isSidenavOpen={this.state.isSidenavOpen} />
        <section className="content">
          <Header
            onMenuClick={this.toggleSidenav}
            title="GDPR Advanced Tools"
            greeting="Welcome, Admin"
          />
          <Switch>
            <Route
              exact
              path="/kitchen-sink/overview"
              render={() => (
                <Overview
                  title="Overview"
                  desc="This is an overview of all the processed data."
                  onClick={this.togglePanel}
                  closePanel={this.closePanel}
                  processors={processors}
                  activeUsers={users[0]}
                  erasedUsers={users[1]}
                />
              )}
            />
            <Route
              exact
              path="/kitchen-sink/processors"
              render={() => (
                <Processors
                  title="Processors"
                  desc="This is an overview of all the current data processors."
                  onClick={this.togglePanel}
                  closePanel={this.closePanel}
                  processors={processors}
                />
              )}
            />
            <Route exact path="/kitchen-sink/loader" render={() => <Loader />} />
          </Switch>
          <Panel
            isPanelOpen={this.state.isPanelOpen}
            onCloseClick={this.closePanel}
            title={this.state.panelData.title}
            content={<Form />}
          />
        </section>
      </main>
    );
  }
}

export default Dashboard;
