import React from 'react';
import PropTypes from 'prop-types';
import styles from '../../theme/Button.scss';

class Button extends React.Component {
  constructor(props) {
    super(props);
    this.state = { showMenu: false };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    console.log('should open sidebar/menu/modal', this);
  }

  render() {
    return (
      <button className={styles.button} onClick={this.handleClick}>
        {this.props.children}
      </button>
    );
  }
}

Button.propTypes = {
  styles: PropTypes.object
};

export default Button;
