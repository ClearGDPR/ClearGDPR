import React from 'react';
import PropTypes from 'prop-types';

import { processorType } from 'types';
import { PanelConsumer } from 'containers/MainLayout/PanelContext';
import { ProcessorsConsumer } from './ProcessorsContext';

import Processors from 'components/Processors/Processors';
import EditProcessor from './EditProcessor';
import AddProcessor from './AddProcessor';
import DeleteProcessor from './DeleteProcessor';

export class ProcessorsContainer extends React.Component {
  static propTypes = {
    openPanel: PropTypes.func,
    processors: PropTypes.arrayOf(processorType),
    isLoading: PropTypes.bool,
    fetchProcessors: PropTypes.func
  };

  state = {
    isDeleteModalOpen: false,
    processorToDeleteId: 0
  };

  componentDidMount() {
    this.props.fetchProcessors();
  }

  openEditProcessorForm = processor => {
    this.props.openPanel(EditProcessor, 'Edit processor', { processor });
  };

  openCreateProcessorForm = () => {
    this.props.openPanel(AddProcessor, 'Create processor');
  };

  openDeleteConfirmationModal = processorId => {
    this.setState({
      isDeleteModalOpen: true,
      processorToDeleteId: processorId
    });
  };

  render() {
    return (
      <Processors
        processors={this.props.processors}
        isLoading={this.props.isLoading}
        onCreateProcessorClick={this.openCreateProcessorForm}
        onEditProcessorClick={this.openEditProcessorForm}
        onDeleteProcessorClick={this.openDeleteConfirmationModal}
      >
        <DeleteProcessor
          isOpen={this.state.isDeleteModalOpen}
          onClose={() => this.setState({ isDeleteModalOpen: false })}
          processorId={this.state.processorToDeleteId}
        />
      </Processors>
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
