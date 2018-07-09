import React from 'react';
import PropTypes from 'prop-types';

import { RectificationsConsumer } from 'containers/Rectifications/RectificationsContext';
import { PanelConsumer } from 'containers/MainLayout/PanelContext';

import Rectifications from 'components/Rectifications/Rectifications';
import Details from 'components/Rectifications/Details';

export class RectificationsContainer extends React.Component {
  static propTypes = {
    pendingRectifications: PropTypes.object.isRequired,
    processedRectifications: PropTypes.object.isRequired,
    fetchPendingRectifications: PropTypes.func.isRequired,
    fetchProcessedRectifications: PropTypes.func.isRequired,
    fetchAllRectifications: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
    openPanel: PropTypes.func.isRequired
  };

  state = {
    selectedTab: 0,
    tabs: ['Pending requests', 'Requests archive']
  };

  get pendingTabActive() {
    return this.state.selectedTab === 0;
  }

  onTabSelect(tabIndex) {
    this.setState({
      selectedTab: tabIndex
    });
  }

  getRectificationsData() {
    if (this.pendingTabActive) {
      return this.props.pendingRectifications;
    } else {
      return this.props.processedRectifications;
    }
  }

  getData() {
    return this.getRectificationsData().data || [];
  }

  componentDidMount() {
    this.props.fetchAllRectifications();
  }

  getPageCount() {
    const paging = this.getRectificationsData().paging;
    return paging ? paging.total : 1;
  }

  getCurrentPage() {
    const paging = this.getRectificationsData().paging;
    return paging ? paging.current : 1;
  }

  onPageSelected(page) {
    if (this.pendingTabActive) {
      this.props.fetchPendingRectifications(page);
    } else {
      this.props.fetchProcessedRectifications(page);
    }
  }

  onDetailsClick(id) {
    this.props.openPanel(Details, 'Rectification details', { rectificationId: id });
  }

  render() {
    return (
      <Rectifications
        tabs={this.state.tabs}
        selectedTab={this.state.selectedTab}
        onTabSelect={this.onTabSelect.bind(this)}
        pageCount={this.getPageCount()}
        currentPage={this.getCurrentPage()}
        data={this.getData()}
        isLoading={this.props.isLoading}
        onPageSelected={this.onPageSelected.bind(this)}
        onDetailsClick={this.onDetailsClick.bind(this)}
      />
    );
  }
}

export default props => (
  <PanelConsumer>
    {({ openPanel }) => (
      <RectificationsConsumer>
        {({
          pendingRectifications,
          processedRectifications,
          fetchPendingRectifications,
          fetchProcessedRectifications,
          fetchAllRectifications,
          isLoading
        }) => (
          <RectificationsContainer
            {...props}
            pendingRectifications={pendingRectifications}
            processedRectifications={processedRectifications}
            fetchPendingRectifications={fetchPendingRectifications}
            fetchProcessedRectifications={fetchProcessedRectifications}
            fetchAllRectifications={fetchAllRectifications}
            isLoading={isLoading}
          />
        )}
      </RectificationsConsumer>
    )}
  </PanelConsumer>
);
