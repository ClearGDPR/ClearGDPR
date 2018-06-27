import React from 'react';
import PropTypes from 'prop-types';

import Processors from '../../components/Processors/Processors';
import config from '../../config';
import session from '../../helpers/Session';
import { PanelConsumer } from '../MainLayout/PanelContext';
import Form from '../../components/core/cards/dashboard/Form';

export class ProcessorsContainer extends React.Component {
  static propTypes = {
    openPanel: PropTypes.func
  };

  state = {
    processors: [],
    isLoading: true
  };

  async getProcessors() {
    const response = await fetch(`${config.API_URL}/api/management/processors/list`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.getToken()}`
      }
    });

    return await response.json();
  }

  componentDidMount() {
    this.getProcessors()
      .then(processors =>
        this.setState({
          processors,
          isLoading: false
        })
      )
      .catch(e => {
        console.error(e);
        this.setState({
          isLoading: false
        });
      });
  }

  onEditProcessorForm() {
    this.props.openPanel(Form);
  }

  render() {
    return (
      <Processors
        processors={this.state.processors}
        isLoading={this.state.isLoading}
        onEditProcessorClick={this.onEditProcessorForm.bind(this)}
      />
    );
  }
}

export default props => (
  <PanelConsumer>
    {({ openPanel }) => <ProcessorsContainer {...props} openPanel={openPanel} />}
  </PanelConsumer>
);
