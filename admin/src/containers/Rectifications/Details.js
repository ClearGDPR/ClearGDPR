import React from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { toast } from 'react-toastify';

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
            created_at: format(new Date(r.createdAt), 'DD/MM/YYYY h:mma'),
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

  onApprove() {
    this.props
      .approveRectification(this.props.rectificationId)
      .then(() => this.props.closePanel())
      .catch(e => toast.error(e.message));
  }

  render() {
    return (
      <Details
        rectification={this.state.rectification}
        onApprove={this.onApprove.bind(this)}
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
