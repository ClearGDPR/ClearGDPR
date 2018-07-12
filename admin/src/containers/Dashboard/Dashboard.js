import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SubjectsList from './Widgets/SubjectsList';
import ControllerConsentDial from 'components/Dashboard/Widgets/ControllerConsentDial';
import ConsentByProcessor from 'components/Dashboard/Widgets/ConsentByProcessor';
import { StatsConsumer } from './StatsContext';

// so we can invoke the fetching from here rather than the individual component
class Stats extends Component {
  componentDidMount() {
    console.log(this.props);
    this.props.fetchStats();
  }
  render() {
    return (
      <React.Fragment>
        <ControllerConsentDial
          consented={this.props.stats.controller.consented}
          unconsented={this.props.stats.controller.unconsented}
          isLoading={this.props.isLoading}
        />
        <ConsentByProcessor
          totalSubjects={this.props.stats.controller.total}
          processors={Object.values(this.props.stats.processors)}
          isLoading={this.props.isLoading}
        />
      </React.Fragment>
    );
  }
}

Stats.propTypes = {
  stats: PropTypes.Object,
  fetchStats: PropTypes.func,
  isLoading: PropTypes.bool
};

export default class Dashboard extends Component {
  render() {
    return (
      <section className="cards">
        <div className="row">
          <SubjectsList />
        </div>
        <div className="row">
          <StatsConsumer>{statsState => <Stats {...statsState} />}</StatsConsumer>
        </div>
      </section>
    );
  }
}
