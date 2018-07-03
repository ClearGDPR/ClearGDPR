import React from 'react';
import Rectifications from 'components/Rectifications/Rectifications';

export class RectificationsContainer extends React.Component {
  static propTypes = {};

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
      return [
        {
          id: 1,
          request_reason: 'The data was incorrect.',
          created_at: '2018-07-02T21:31:24.999Z'
        },
        {
          id: 2,
          request_reason: 'The data was incorrect two.',
          created_at: '2018-07-02T21:31:37.440Z'
        },
        {
          id: 3,
          request_reason: 'The data was incorrect two three.',
          created_at: '2018-07-02T21:31:43.530Z'
        }
      ];
    } else {
      return [
        {
          id: 1,
          request_reason: 'The data was incorrect.',
          created_at: '2018-07-02T21:31:24.999Z',
          status: 'Disapproved'
        },
        {
          id: 2,
          request_reason: 'The data was incorrect two.',
          created_at: '2018-07-02T21:31:37.440Z',
          status: 'Approved'
        },
        {
          id: 3,
          request_reason: 'The data was incorrect two three.',
          created_at: '2018-07-02T21:31:43.530Z',
          status: 'Approved'
        }
      ];
    }
  }

  render() {
    return (
      <Rectifications
        tabs={this.state.tabs}
        selectedTab={this.state.selectedTab}
        onTabSelect={this.onTabSelect.bind(this)}
        pageCount={1}
        currentPage={1}
        data={this.getData()}
      />
    );
  }
}

export default RectificationsContainer;
