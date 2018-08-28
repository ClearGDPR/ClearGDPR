import React from 'react';
import PropTypes from 'prop-types';
import styles from '../../theme/Switch.scss';

class Switch extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      value: props.value
    };
  }

  componentDidUpdate() {
    this.setState({ value: this.props.value });
  }

  handleClick() {
    if (this.props.disabled) {
      return;
    }
    this.setState(prevState => ({
      value: !prevState.value
    }));

    if (this.props.onChange) {
      this.props.onChange(!this.state.value);
    }
  }

  render() {
    const classes = [styles.switch, this.state.value ? styles.switchOn : ''].join(' ');

    return (
      <div className={classes} onClick={this.handleClick.bind(this)}>
        <div className={styles.switchToggle} />
      </div>
    );
  }
}

Switch.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.bool,
  disabled: PropTypes.bool
};

export default Switch;
