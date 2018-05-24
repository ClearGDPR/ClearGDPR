import React from 'react';
import PropTypes from 'prop-types';
import Processor from './Processor';

class ProcessorsList extends React.PureComponent {
  render() {
    const { processors } = this.props;

    return (
      <React.Fragment>
        {processors.length > 0
          ? processors.map(p => (
              <Processor
                key={p.id}
                processor={p}
                onProcessorChange={this.props.onProcessorChange}
              />
            ))
          : 'No processors'}
      </React.Fragment>
    );
  }
}

ProcessorsList.propTypes = {
  styles: PropTypes.object // TODO: not necessarily useful here
};

export default ProcessorsList;
