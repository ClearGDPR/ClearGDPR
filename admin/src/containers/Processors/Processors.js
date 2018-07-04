import React from 'react';
import PropTypes from 'prop-types';

import { PanelConsumer } from 'containers/MainLayout/PanelContext';
import { ProcessorsConsumer } from './ProcessorsContext';

import Processors from 'components/Processors/Processors';
import EditProcessor from './EditProcessor';
import AddProcessor from './AddProcessor';

export class ProcessorsContainer extends React.Component {
  static propTypes = {
    openPanel: PropTypes.func,
    processors: PropTypes.arrayOf(PropTypes.object),
    isLoading: PropTypes.bool,
    fetchProcessors: PropTypes.func
  };

  componentDidMount() {
    this.props.fetchProcessors();
  }

  openEditProcessorForm(processor) {
    this.props.openPanel(EditProcessor, 'Edit processor', { processor });
  }

  openCreateProcessorForm() {
    this.props.openPanel(AddProcessor, 'Create processor');
  }

  render() {
    return (
      <Processors
        processors={this.props.processors}
        isLoading={this.props.isLoading}
        onCreateProcessorClick={this.openCreateProcessorForm.bind(this)}
        onEditProcessorClick={this.openEditProcessorForm.bind(this)}
      />
    );
  }
}

export default props => (
  <PanelConsumer>
    {({ openPanel }) => (
      <ProcessorsConsumer>
        {({ processors, isLoading, fetchProcessors }) => (
          <ProcessorsContainer
            {...props}
            processors={processors}
            isLoading={isLoading}
            fetchProcessors={fetchProcessors}
            openPanel={openPanel}
          />
        )}
      </ProcessorsConsumer>
    )}
  </PanelConsumer>
);
