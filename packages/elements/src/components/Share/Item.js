import React from 'react';
import PropTypes from 'prop-types';

import styles from 'theme/ShareData.scss';
import clipboardSvg from 'assets/graph_clipboard.svg';

import EditForm from './Edit';
import Delete from './Delete';

class ShareDataItem extends React.Component {
  state = {
    isEdit: false,
    isDelete: false
  };

  showOnDelete = e => {
    e.preventDefault();
    this.setState({ isDelete: true });
  };

  showOnEdit = e => {
    e.preventDefault();
    this.setState({ isEdit: true });
  };

  render() {
    const { share, onUpdate, onDelete, onCopy } = this.props;
    const { isEdit, isDelete } = this.state;

    return (
      <div className={`${styles.card} ${(isEdit || isDelete) && styles.cardHover}`}>
        {isEdit ? (
          <div className={styles.cardBack}>
            <EditForm
              initialValues={share}
              onSubmit={onUpdate}
              onCancel={e => {
                e.preventDefault();
                this.setState({ isEdit: false });
              }}
            />
          </div>
        ) : isDelete ? (
          <div className={`${styles.cardBack} ${styles.cardDelete}`}>
            <Delete
              onDelete={e => onDelete(e, share.id)}
              onCancel={e => {
                e.preventDefault();
                this.setState({ isDelete: false });
              }}
            />
          </div>
        ) : (
          <React.Fragment>
            <a className={`is-pulled-right ${styles.deleteIcon}`} onClick={this.showOnDelete}>
              <span className="icon">
                <i className="far fa-trash-alt" />
              </span>
            </a>
            <div>
              <span className={styles.shareImg}>
                <img src={clipboardSvg} alt={share.name} style={{ height: 35 }} />
              </span>
              <div className={styles.shareName}>{share.name}</div>
              <div className={styles.shareUrl}>{share.url}</div>
              <button
                className="button is-small is-outlined"
                style={{ position: 'absolute', bottom: 15, right: 15 }}
                onClick={e => onCopy(e, share.url)}
              >
                Copy URL
              </button>
            </div>
          </React.Fragment>
        )}
      </div>
    );
  }
}

ShareDataItem.propTypes = {
  share: PropTypes.object,
  onUpdate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onCopy: PropTypes.func.isRequired
};

export default ShareDataItem;
