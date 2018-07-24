import React from 'react';
import PropTypes from 'prop-types';

import { ProcessorsConsumer } from './ProcessorsContext';
import { PanelConsumer } from 'containers/MainLayout/PanelContext';
import EditProcessorForm from 'components/Processors/EditProcessor';

export class AddProcessorContainer extends React.Component {
  static propTypes = {
    addProcessor: PropTypes.func,
    closePanel: PropTypes.func
  };

  state = {
    isLoading: false,
    errors: {}
  };

  onSubmit = processor => {
    this.setState({
      isLoading: true
    });

    processor.scopes = Object.keys(processor.scopes).reduce((scopes, s) => {
      return processor.scopes[s] ? scopes.concat(s) : scopes;
    }, []);

    return this.props
      .addProcessor(processor)
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
        {({ addProcessor, isLoading }) => (
          <AddProcessorContainer
            {...props}
            isLoading={isLoading}
            addProcessor={addProcessor}
            closePanel={closePanel}
          />
        )}
      </ProcessorsConsumer>
    )}
  </PanelConsumer>
);
