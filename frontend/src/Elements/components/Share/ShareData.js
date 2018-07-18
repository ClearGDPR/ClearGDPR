import React from 'react';
import PropTypes from 'prop-types';
import Copy from 'copy-to-clipboard';

import styles from '../../theme/ShareData.scss';
import clipboardSvg from '../../../assets/graph_clipboard.svg';

import NewForm from './Edit';
import ShareDataItem from './Item';

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
              <NewForm
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
