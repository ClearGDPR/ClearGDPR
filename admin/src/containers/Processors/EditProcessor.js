import React from 'react';
import PropTypes from 'prop-types';

import { ProcessorsConsumer } from './ProcessorsContext';
import { PanelConsumer } from 'containers/MainLayout/PanelContext';
import EditProcessorForm from 'components/Processors/EditProcessor';

export class EditProcessorContainer extends React.Component {
  static propTypes = {
    updateProcessor: PropTypes.func,
    processor: PropTypes.object,
    closePanel: PropTypes.func
  };

  state = {
    errors: {}
  };

  onSubmit(processor) {
    // Clone data to avoid updating form until save is done
    const processorData = Object.assign({}, processor);
    delete processorData.address;
    processorData.scopes = Object.keys(processor.scopes).reduce((scopes, s) => {
      return processor.scopes[s] ? scopes.concat(s) : scopes;
    }, []);

    return this.props
      .updateProcessor(processorData)
      .then(() => this.props.closePanel())
      .catch(e =>
        this.setState({
          errors: {
            processor: e.toString()
          }
        })
      );
  }

  render() {
    return (
      <EditProcessorForm
        values={this.props.processor}
        errors={this.state.errors}
        onSubmit={this.onSubmit.bind(this)}
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
            isLoading={isLoading}
            updateProcessor={updateProcessor}
            closePanel={closePanel}
          />
        )}
      </ProcessorsConsumer>
    )}
  </PanelConsumer>
);
