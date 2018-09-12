import React, { Component } from 'react';
import PropTypes from 'prop-types';
import config from 'config';
import SubjectsList from './Widgets/SubjectsList';
import EventsList from './Widgets/EventsList';
import ControllerConsentDial from 'components/Dashboard/Widgets/ControllerConsentDial';
import ConsentByProcessor from 'components/Dashboard/Widgets/ConsentByProcessor';
import { StatsConsumer } from './StatsContext';

import NumberCard from 'components/core/cards/dashboard/NumberCard';
import ChartCard from 'components/core/cards/dashboard/ChartCard';

const activeUsers = {
  title: 'Active Users',
  number: 12.676,
  change: 14
};
const erasedUsers = {
  title: 'Erased Users',
  number: 1.164,
  change: -10
};

// so we can invoke the fetching from here rather than the individual component
class Stats extends Component {
  componentDidMount() {
    this.props.fetchStats();
  }
  render() {
    return (
      <React.Fragment>
        <div className="row">
          <div style={{ display: 'flex', flexGrow: 12 }}>
            <NumberCard cols={2} data={activeUsers} onClick={this.props.onClick} />
            <NumberCard cols={2} data={erasedUsers} onClick={this.props.onClick} />
            <ConsentByProcessor
              totalSubjects={this.props.stats.controller.total}
              processors={Object.values(this.props.stats.processors)}
              isLoading={this.props.isLoading}
            />
          </div>
        </div>
        <div className="row">
          <div style={{ display: 'flex', flexGrow: 12 }}>
            <ControllerConsentDial
              consented={this.props.stats.controller.consented}
              unconsented={this.props.stats.controller.unconsented}
              isLoading={this.props.isLoading}
            />
            <ChartCard cols={2} data={{ title: 'Requests - Last 7 days' }} />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

Stats.propTypes = {
  stats: PropTypes.object,
  fetchStats: PropTypes.func,
  isLoading: PropTypes.bool,
  onClick: PropTypes.func
};

export default class Dashboard extends Component {
  render() {
    return (
      <section className="cards">
        <div className="row">
          <StatsConsumer>{statsState => <Stats {...statsState} />}</StatsConsumer>
        </div>
        <SubjectsList />
        <EventsList
          webSocketUrl={config.API_URL.replace('http://', 'ws://') + '/api/management/events/feed'}
        />
      </section>
    );
  }
}
