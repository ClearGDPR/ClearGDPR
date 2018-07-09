import React from 'react';
import PropTypes from 'prop-types';

import { rectificationDetailsType } from 'types';
import { RectificationsConsumer } from './RectificationsContext';
import { PanelConsumer } from 'containers/MainLayout/PanelContext';
import Details from 'components/Rectifications/Details';

export class DetailsContainer extends React.Component {
  static propTypes = {
    approveRectification: PropTypes.func,
    rectification: rectificationDetailsType.isRequired,
    closePanel: PropTypes.func
  };

  state = {
    errors: {}
  };

  onApprove() {
    return this.props
      .approveRectification(this.props.rectification.id)
      .then(() => this.props.closePanel());
  }

  render() {
    return (
      <Details
        rectification={this.props.rectification}
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
