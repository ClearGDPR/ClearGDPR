import React from 'react';
import PropTypes from 'prop-types';
import Rectifications from 'components/Rectifications/Rectifications';
import { RectificationsConsumer } from 'containers/Rectifications/RectificationsContext';

export class RectificationsContainer extends React.Component {
  static propTypes = {
    pendingRectifications: PropTypes.object.isRequired,
    processedRectifications: PropTypes.object.isRequired,
    fetchPendingRectifications: PropTypes.func.isRequired,
    fetchProcessedRectifications: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired
  };

  state = {
    selectedTab: 0,
    tabs: ['Pending requests', 'Requests archive']
  };

  onTabSelect(tabIndex) {
    this.setState({
      selectedTab: tabIndex
    });
  }

  getData() {
    if (this.state.selectedTab === 0) {
      return this.props.pendingRectifications.data || [];
    } else {
      return this.props.processedRectifications.data || [];
    }
  }

  componentDidMount() {
    this.props.fetchPendingRectifications();
    this.props.fetchProcessedRectifications();
  }

  render() {
    return (
      <Rectifications
        tabs={this.state.tabs}
        selectedTab={this.state.selectedTab}
        onTabSelect={this.onTabSelect.bind(this)}
        pageCount={2}
        currentPage={1}
        data={this.getData()}
        isLoading={this.props.isLoading}
      />
    );
  }
}

export default props => (
  <RectificationsConsumer>
    {({
      pendingRectifications,
      processedRectifications,
      fetchPendingRectifications,
      fetchProcessedRectifications,
      isLoading
    }) => (
      <RectificationsContainer
        {...props}
        pendingRectifications={pendingRectifications}
        processedRectifications={processedRectifications}
        fetchPendingRectifications={fetchPendingRectifications}
        fetchProcessedRectifications={fetchProcessedRectifications}
        isLoading={isLoading}
      />
    )}
  </RectificationsConsumer>
);
