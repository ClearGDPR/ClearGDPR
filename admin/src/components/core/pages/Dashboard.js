import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import Sidenav from './../cards/dashboard/Sidenav';
import Header from './../cards/dashboard/Header';
import Overview from './../cards/dashboard/Overview';
import Processors from './../cards/dashboard/Processors';
import Panel from './../cards/dashboard/Panel';
import Loader from './../cards/dashboard/Loader';
import './dashboard.css';

import nielsenIMG from '../../../assets/images/processors/nielsen.svg';
import liverampIMG from '../../../assets/images/processors/liveramp.svg';
import experianIMG from '../../../assets/images/processors/experian.svg';

let lorem =
  'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum placeat neque, pariatur ipsa qui facere nobis error iste consectetur quo exercitationem!';

export const processors = [
  {
    name: 'Nielsen',
    img: nielsenIMG,
    consented: 72,
    description: lorem,
    scope: ['Full Name', 'Email', 'Phone Number']
  },
  {
    name: 'Live Ramp',
    img: liverampIMG,
    consented: 64,
    description: lorem,
    scope: ['Email']
  },
  {
    name: 'Experian',
    img: experianIMG,
    consented: 25,
    description: lorem,
    scope: ['Full Name', 'Phone Number']
  }
];

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
        {this.state.isPanelOpen ? <section className="overlay" onClick={this.togglePanel} /> : null}
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
                  processors={processors}
                  activeUsers={users[0]}
                  erasedUsers={users[1]}
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
                  processors={processors}
                />
              )}
            />
            <Route exact path="/dashboard/preferences" render={() => <Loader />} />
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
