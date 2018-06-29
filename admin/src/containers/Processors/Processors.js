import React from 'react';
import PropTypes from 'prop-types';

import Processors from 'components/Processors/Processors';
import config from 'config';
import { PanelConsumer } from 'containers/MainLayout/PanelContext';
import Form from 'components/core/cards/dashboard/Form';
import internalFetch from 'helpers/internal-fetch';

export class ProcessorsContainer extends React.Component {
  static propTypes = {
    openPanel: PropTypes.func
  };

  state = {
    processors: [],
    isLoading: true
  };

  async getProcessors() {
    return internalFetch(`${config.API_URL}/api/management/processors/list`);
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
