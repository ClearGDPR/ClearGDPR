import React from 'react';
import PropTypes from 'prop-types';

import { ProcessorsConsumer } from './ProcessorsContext';
import DeleteProcessor from 'components/Processors/DeleteProcessor';

export class DeleteProcessorContainer extends React.Component {
  static propTypes = {
    processorId: PropTypes.number.isRequired,
    deleteProcessor: PropTypes.func.isRequired,
    onClose: PropTypes.func,
    isOpen: PropTypes.bool
  };

  state = {
    isLoading: false
  };

  deleteProcessor = () => {
    this.setState({
      isLoading: true
    });
    this.props
      .deleteProcessor(this.props.processorId)
      .then(this.props.onClose)
      .catch(() => {
        this.setState({
          isLoading: false
        });
      });
  };

  render() {
    return (
      <DeleteProcessor
        onConfirm={this.deleteProcessor}
        onCancel={this.props.onClose}
        isOpen={this.props.isOpen}
        isLoading={this.state.isLoading}
      />
    );
  }
}

export default props => (
  <ProcessorsConsumer>
    {({ deleteProcessor }) => (
      <DeleteProcessorContainer {...props} deleteProcessor={deleteProcessor} />
    )}
  </ProcessorsConsumer>
);
