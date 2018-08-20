import React from 'react';
import PropTypes from 'prop-types';
import { AttributesConfigConsumer } from 'containers/Data/AttributesConfigContext';
import DataAttributesEditor from 'components/Data/DataAttributesEditor';

class DataAttributesEditorContainer extends React.Component {
  static propTypes = {
    fetchConfig: PropTypes.func.isRequired,
    updateConfig: PropTypes.func.isRequired,
    config: PropTypes.object,
    isBusy: PropTypes.bool.isRequired
  };

  componentDidMount() {
    this.props.fetchConfig();
  }

  render() {
    const { config, isBusy, updateConfig } = this.props;
    return <DataAttributesEditor {...{ config, isBusy, updateConfig }} />;
  }
}

export default props => (
  <AttributesConfigConsumer>
    {({ fetchConfig, updateConfig, config, isBusy }) => (
      <DataAttributesEditorContainer {...{ ...props, fetchConfig, updateConfig, config, isBusy }} />
    )}
  </AttributesConfigConsumer>
);
