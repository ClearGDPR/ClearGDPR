import React from 'react';
import PropTypes from 'prop-types';

import Switch from 'components/Common/Switch';
import styles from 'theme/Processor.scss';

class Processor extends React.PureComponent {
  onChange(status) {
    this.props.onProcessorChange({
      ...this.props.processor,
      enabled: status
    });
  }

  render() {
    const { processor } = this.props;
    return (
      <div className={styles.container}>
        <div className={styles.processor}>
          <img className={styles.logo} src={processor.logoUrl} alt={processor.name} />
          <Switch value={processor.enabled} onChange={this.onChange.bind(this)} />
        </div>
        <div className={styles.description}>{processor.description}</div>
        <ul className={styles.scopes}>
          {processor.scopes.map((scope, index) => <li key={index}>{scope}</li>)}
        </ul>
      </div>
    );
  }
}

Processor.propTypes = {
  onProcessorChange: PropTypes.func.isRequired,
  processor: PropTypes.shape({
    enabled: PropTypes.bool,
    name: PropTypes.string,
    logoUrl: PropTypes.string,
    description: PropTypes.string,
    scopes: PropTypes.arrayOf(PropTypes.string),
    purposes: PropTypes.arrayOf(PropTypes.string)
  })
};

export default Processor;
