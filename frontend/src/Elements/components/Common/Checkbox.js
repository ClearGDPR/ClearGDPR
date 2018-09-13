import React from 'react';
import PropTypes from 'prop-types';

import styles from 'theme/Checkbox.scss';

class Checkbox extends React.PureComponent {
  render() {
    const exStyles = this.props.styles || {};

    return (
      <label className={styles.labelWrapper} htmlFor={this.props.id} name={this.props.name}>
        <input
          className={styles.checkbox}
          type="checkbox"
          id={this.props.id}
          required={this.props.required}
          onChange={this.props.onChange}
        />
        <span style={exStyles.label} className={styles.label}>
          {this.props.label}
        </span>
      </label>
    );
  }
}

Checkbox.propTypes = {
  id: PropTypes.any,
  name: PropTypes.string,
  label: PropTypes.string,
  required: PropTypes.bool,
  styles: PropTypes.object,
  onChange: PropTypes.func
};

export default Checkbox;
