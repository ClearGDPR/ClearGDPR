import React from 'react';
import PropTypes from 'prop-types';
import format from 'helpers/date-formatter';

import config from 'config';
import internalFetch from 'helpers/internal-fetch';

import { RectificationsConsumer } from './RectificationsContext';
import { PanelConsumer } from 'containers/MainLayout/PanelContext';
import Details from 'components/Rectifications/Details';

export class DetailsContainer extends React.Component {
  static propTypes = {
    approveRectification: PropTypes.func,
    rectificationId: PropTypes.number,
    closePanel: PropTypes.func,
    isLoading: PropTypes.bool
  };

  state = {
    rectification: {}
  };

  componentDidMount() {
    this.setState({
      isLoading: true
    });

    internalFetch(
      `${config.API_URL}/api/management/subjects/rectification-requests/${
        this.props.rectificationId
      }`
    )
      .then(r =>
        this.setState({
          rectification: {
            created_at: format(r.createdAt),
            currentData: r.currentData,
            updates: r.updates,
            status: r.status
          },
          isLoading: false
        })
      )
      .catch(() => this.setState({ isLoading: false }));
  }

  get isLoading() {
    return this.state.isLoading || this.props.isLoading;
  }

  onApprove = () => {
    this.setState({
      isLoading: true
    });

    this.props
      .approveRectification(this.props.rectificationId)
      .then(() => this.props.closePanel())
      .catch(() => {
        this.setState({
          isLoading: false
        });
      });
  };

  render() {
    return (
      <Details
        rectification={this.state.rectification}
        onApprove={this.onApprove}
        isLoading={this.isLoading}
      />
    );
  }
}

export default props => (
  <PanelConsumer>
    {({ closePanel }) => (
      <RectificationsConsumer>
        {({ approveRectification, isLoading }) => (
          <DetailsContainer
            {...props}
            isLoading={isLoading}
            approveRectification={approveRectification}
            closePanel={closePanel}
          />
        )}
      </RectificationsConsumer>
    )}
  </PanelConsumer>
);
