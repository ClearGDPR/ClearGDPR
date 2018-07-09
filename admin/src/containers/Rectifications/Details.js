import React from 'react';
import PropTypes from 'prop-types';

import config from 'config';
import internalFetch from 'helpers/internal-fetch';

import { RectificationsConsumer } from './RectificationsContext';
import { PanelConsumer } from 'containers/MainLayout/PanelContext';
import Details from 'components/Rectifications/Details';

export class DetailsContainer extends React.Component {
  static propTypes = {
    approveRectification: PropTypes.func,
    rectificationId: PropTypes.number,
    closePanel: PropTypes.func
  };

  state = {
    rectification: {}
  };

  componentDidMount() {
    internalFetch(
      `${config.API_URL}/api/management/subjects/rectification-requests/${
        this.props.rectificationId
      }`
    ).then(rectification => this.setState({ rectification }));
  }

  onApprove() {
    return this.props
      .approveRectification(this.state.rectification.id)
      .then(() => this.props.closePanel());
  }

  render() {
    return (
      <Details
        rectification={this.state.rectification}
        onApprove={this.onApprove.bind(this)}
        isLoading={this.state.isLoading}
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
