import React from 'react';
import ConsentDial from 'components/Dashboard/Widgets/ConsentDial';

export class ConsentDialContainer extends React.Component {
  state = {
    isLoading: false,
    data: {}
  };

  render() {
    return (
      <ConsentDial
        consented={this.state.data.consented}
        unconsented={this.state.data.unconsented}
      />
    );
  }
}

export default ConsentDialContainer;
