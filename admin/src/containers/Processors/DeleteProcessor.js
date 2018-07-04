import React from 'react';
import PropTypes from 'prop-types';

import { ProcessorsConsumer } from './ProcessorsContext';
import DeleteProcessor from 'components/Processor/DeleteProcessor';

export class DeleteProcessorContainer extends React.Component {
  static propTypes = {
    processor: PropTypes.object.isRequired,
    deleteProcessor: PropTypes.func.isRequired,
    onClose: PropTypes.func,
    isOpen: PropTypes.bool,
    isLoading: PropTypes.bool
  };

  deleteProcessor() {
    this.props.deleteProcessor(this.props.processor.id).then(this.props.onClose);
  }

  render() {
    return (
      <DeleteProcessor
        onConfirm={this.deleteProcessor.bind(this)}
        onCancel={this.props.onClose}
        isOpen={this.props.isOpen}
        isLoading={this.props.isLoading}
      />
    );
  }
}

export default props => (
  <ProcessorsConsumer>
    {({ deleteProcessor, isLoading }) => (
      <DeleteProcessorContainer {...props} isLoading={isLoading} deleteProcessor={deleteProcessor} />
    )}
  </ProcessorsConsumer>
);
