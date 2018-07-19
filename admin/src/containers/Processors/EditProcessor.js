import React from 'react';
import PropTypes from 'prop-types';

import { processorType } from 'types';
import { ProcessorsConsumer } from './ProcessorsContext';
import { PanelConsumer } from 'containers/MainLayout/PanelContext';
import EditProcessorForm from 'components/Processors/EditProcessor';

export class EditProcessorContainer extends React.Component {
  static propTypes = {
    updateProcessor: PropTypes.func,
    processor: processorType.isRequired,
    closePanel: PropTypes.func
  };

  static defaultProps = {
    processor: {}
  };

  state = {
    isLoading: false,
    errors: {}
  };

  onSubmit = processor => {
    this.setState({
      isLoading: true
    });

    // Clone data to avoid updating form until save is done
    const processorData = Object.assign({}, processor);
    if (!processorData.address) {
      delete processorData.address;
    }

    processorData.scopes = Object.keys(processor.scopes).reduce((scopes, s) => {
      return processor.scopes[s] ? scopes.concat(s) : scopes;
    }, []);

    return this.props
      .updateProcessor(processorData)
      .then(() => this.props.closePanel())
      .catch(e =>
        this.setState({
          isLoading: false,
          errors: {
            processor: e.toString()
          }
        })
      );
  };

  render() {
    return (
      <EditProcessorForm
        values={this.props.processor}
        errors={this.state.errors}
        onSubmit={this.onSubmit}
        isLoading={this.state.isLoading}
      />
    );
  }
}

export default props => (
  <PanelConsumer>
    {({ closePanel }) => (
      <ProcessorsConsumer>
        {({ updateProcessor, isLoading }) => (
          <EditProcessorContainer
            {...props}
            updateProcessor={updateProcessor}
            closePanel={closePanel}
          />
        )}
      </ProcessorsConsumer>
    )}
  </PanelConsumer>
);
