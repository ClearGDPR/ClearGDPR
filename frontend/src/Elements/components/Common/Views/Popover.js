import React from 'react';
import PropTypes from 'prop-types';

import styles from '../../../theme/Views/Popover.scss';

class PopoverView extends React.PureComponent {
  onClose(e) {
    if (this.props.onClose) {
      this.props.onClose(e);
    }
  }

  render() {
    const { open, children } = this.props;

    return (
      <React.Fragment>
        {open ? <div className={styles.overlay} onClick={this.onClose.bind(this)} /> : null}
        <div className={styles.popover}>
          <svg className={styles.popoverTipWrapper}>
            <polygon className={styles.popoverTip} points="24,0 0,24, 24,48" />
          </svg>
          {children}
        </div>
      </React.Fragment>
    );
  }
}

PopoverView.propTypes = {
  children: PropTypes.node.isRequired,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool
};

export default PopoverView;
