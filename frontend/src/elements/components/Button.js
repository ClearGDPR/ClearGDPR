import React from 'react';
import PropTypes from 'prop-types';
import styles from '../theme/Button.scss';

class Button extends React.Component {
  constructor(props) {
    super(props);
    // console.log(styles, props.styles);
    // this.styles = Object.assign(styles, props.styles);
    this.state = { showMenu: false };
    // TODO: override styles using props
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    console.log('should open sidebar/menu/modal', this);
    // this.setState(prevState => ({
    //   showMenu: !prevState.showMenu
    // }));
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
