import React from 'react';
import PropTypes from 'prop-types';
import Copy from 'copy-to-clipboard';

import styles from 'theme/ShareData.scss';
import clipboardSvg from 'assets/graph_clipboard.svg';

import NewForm from './Edit';
import ShareDataItem from './Item';
import Subject from 'contexts/Subject';

class ShareData extends React.Component {
  state = {
    isNew: false
  };

  showOnNew = e => {
    e.preventDefault();
    this.setState({ isNew: true });
  };

  handleOnCreate = ({ name }) => {
    this.props.subject.addDataShare(name.value);
    this.setState({ isNew: false });
  };

  handleOnUpdate = e => {
    e.preventDefault();
    console.log('Not yet implemented');
    this.setState({ isEdit: false });
  };

  handleOnDelete = (e, shareId) => {
    e.preventDefault();

    this.props.subject.removeDataShare(shareId);
    this.setState({ isDelete: false });
  };

  handleOnCopyURL = (e, toClipboard) => {
    e.preventDefault();
    Copy(toClipboard);
    // TODO: show flash of added to clipboard
  };

  loadDataShares = () => {
    this.props.subject.fetchDataShares();
  };

  componentDidMount() {
    this.props.subject.fetchDataShares();
  }

  render() {
    const { isNew } = this.state;
    const { shares } = this.props.subject;

    return (
      <div className="columns is-mobile is-multiline">
        {(shares || []).map(share => (
          <div key={share.id} className="column">
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
  subject: PropTypes.instanceOf(Subject)
};

export default ShareData;
