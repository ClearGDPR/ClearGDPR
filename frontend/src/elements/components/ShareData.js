import React from 'react';
import PropTypes from 'prop-types';
import Copy from 'copy-to-clipboard';

import Elements from '../components/Elements';
import styles from '../theme/ShareData.scss';
import clipboardSvg from '../../assets/graph_clipboard.svg';

// Get Elements singleton
Elements();

class EditForm extends React.Component {
  handleOnSubmit = e => {
    e.preventDefault();
    this.props.onSubmit(this.refs);
  };

  render() {
    const { onCancel, initialValues = {} } = this.props;

    return (
      <form className={styles.form} onSubmit={this.handleOnSubmit}>
        <div className={styles.formName}>
          <label htmlFor="name">Name</label>
          <input
            ref="name"
            type="text"
            name="name"
            id="name"
            defaultValue={initialValues.name}
            autoComplete="off"
          />
        </div>
        <button
          className="button is-small"
          style={{ position: 'absolute', bottom: 15, left: 15 }}
          onClick={onCancel}
        >
          Go Back
        </button>
        <button
          type="submit"
          className={`button is-small ${styles.buttonGreen}`}
          style={{ position: 'absolute', bottom: 15, right: 15 }}
        >
          Save
        </button>
      </form>
    );
  }
}

const Delete = ({ onDelete, onCancel }) => (
  <React.Fragment>
    <p>Are you sure you want to delete this item? This action cannot be rolled back.</p>
    <div style={{ marginTop: 20 }}>
      <button onClick={onCancel} className="button">
        Go back
      </button>
      &nbsp;
      <button onClick={onDelete} className="button is-danger">
        {"I'm sure"}
      </button>
    </div>
  </React.Fragment>
);

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

class ShareData extends React.Component {
  state = {
    shares: [],
    isNew: false
  };

  showOnNew = e => {
    e.preventDefault();
    this.setState({ isNew: true });
  };

  handleOnCreate = ({ name }) => {
    window.cg.Subject.addDataShare({
      name: name.value
    })
      .then(() => {
        this.loadDataShares();
        this.setState({ isNew: false });
      })
      .catch(err => {
        console.log('failure', err);
      });
  };

  handleOnUpdate = e => {
    e.preventDefault();
    console.log('Not yet implemented');
    this.setState({ isEdit: false });
  };

  handleOnDelete = (e, shareId) => {
    e.preventDefault();

    window.cg.Subject.removeDataShare(shareId)
      .then(() => {
        this.loadDataShares();
        this.setState({ isDelete: false });
      })
      .catch(err => {
        console.log('failure', err);
      });
  };

  handleOnCopyURL = (e, toClipboard) => {
    e.preventDefault();
    Copy(toClipboard);
    // TODO: show flash of added to clipboard
  };

  loadDataShares = () => {
    window.cg.Subject.getDataShares()
      .then(shares => {
        this.setState({ shares });
      })
      .catch(err => {
        console.log('failure', err);
      });
  };

  componentDidMount() {
    const cgToken = localStorage.getItem('cgToken');
    window.cg.setAccessToken(cgToken);
    this.loadDataShares();
  }

  render() {
    const { isNew, shares } = this.state;

    return (
      <div className="columns is-mobile is-multiline">
        {shares.map((share, i) => (
          <div key={i} className="column">
            <ShareDataItem
              share={share}
              onDelete={this.handleOnDelete}
              onUpdate={this.handleOnUpdate}
              onCopy={this.handleOnCopyURL}
            />
          </div>
        ))}
        <div className="column">
          <div className={`${styles.card} ${styles.newCard}`}>
            {!isNew ? (
              <div className={styles.newCardContent} onClick={this.showOnNew}>
                <img src={clipboardSvg} alt="Add new" style={{ width: 62 }} />
                <p>New Share URL</p>
              </div>
            ) : (
              <EditForm
                onSubmit={this.handleOnCreate}
                onCancel={e => {
                  e.preventDefault();
                  this.setState({ isNew: false });
                }}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
}

ShareData.propTypes = {
  styles: PropTypes.object
};

export default ShareData;
