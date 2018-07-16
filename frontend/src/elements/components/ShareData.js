import React from 'react';
import PropTypes from 'prop-types';
import Copy from 'copy-to-clipboard';

import Elements from '../components/Elements';
import styles from '../theme/ShareData.scss';
import clipboardSvg from '../../assets/graph_clipboard.svg';

// Get Elements singleton
Elements();

class ShareData extends React.PureComponent {
  state = {
    shares: [],
    isEdit: false
  };

  handleOnDelete = e => {
    e.preventDefault();
    this.setState({ isDelete: true });
  };

  handleOnDeleteAction = e => {
    e.preventDefault();
    this.setState({ isDelete: false });
  };

  handleOnEdit = e => {
    e.preventDefault();
    this.setState({ isEdit: true });
  };

  handleOnSave = e => {
    e.preventDefault();
    this.setState({ isEdit: false });
  };

  handleAddNew = e => {
    e.preventDefault();
    console.log('Addnew');
  };

  handleOnCopyURL = e => {
    e.preventDefault();
    Copy('test of clipboard');
    // TODO: show flash of added to clipboard
  };

  componentDidMount() {
    setTimeout(() => {
      // const cgToken = localStorage.getItem('cgToken');
      // window.cg.setAccessToken(cgToken);

      const shares = [
        {
          name: 'www.bigdata.com',
          url: 'https://cg-demo.cleargdpr.com/shares/K451ABD23AU8',
          scopes: ['test1', 'test2', 'test3']
        }
      ];

      this.setState({ shares });
      // window.cg.Subject.getProcessors()
      //   .then(processors => {
      //     processors.map(p => {
      //       p.enabled = true;
      //       return p;
      //     });
      //     this.setState({ processors });
      //   })
      //   .catch(err => {
      //     console.log('failure', err);
      //   });
    }, 1000);
  }

  render() {
    const { isEdit, isDelete, shares } = this.state;

    return (
      <div className="columns">
        {shares.map((share, i) => (
          <div key={i} className="column is-half">
            <div className={`${styles.card} ${(isEdit || isDelete) && styles.cardHover}`}>
              {isEdit ? (
                <div className={styles.cardBack}>
                  <form>
                    <label>Name</label>
                    <input type="text" value={share.name} />
                    <span>{share.url}</span>
                    {share.scopes.map(scope => (
                      <React.Fragment>
                        <input type="checkbox" value={true} />
                        <label>{scope}</label>
                      </React.Fragment>
                    ))}
                  </form>
                  <button
                    className="button is-small is-success"
                    onClick={this.handleOnSave}
                    style={{ position: 'absolute', bottom: 0, right: 0 }}
                  >
                    Save
                  </button>
                </div>
              ) : isDelete ? (
                <div className={` ${styles.cardBack} ${styles.cardDelete}`}>
                  <p>
                    Are you sure you want to delete this item? This action cannot be rolled back.
                  </p>
                  <div style={{ marginTop: 20 }}>
                    <button onClick={this.handleOnDeleteAction} className="button">
                      Go back
                    </button>
                    &nbsp;
                    <button onClick={this.handleOnDeleteAction} className="button is-danger">
                      I'm sure
                    </button>
                  </div>
                </div>
              ) : (
                <React.Fragment>
                  <a
                    className={`is-pulled-right ${styles.deleteIcon}`}
                    onClick={this.handleOnDelete}
                  >
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
                    <ul className={styles.scopes}>
                      {share.scopes.map((scope, index) => <li key={index}>{scope}</li>)}
                    </ul>
                    <button
                      className="button is-small is-outlined"
                      onClick={this.handleOnEdit}
                      style={{ position: 'absolute', bottom: 15, left: 15 }}
                    >
                      Edit
                    </button>
                    <button
                      className="button is-small is-outlined"
                      style={{ position: 'absolute', bottom: 15, right: 15 }}
                      onClick={this.handleOnCopyURL}
                    >
                      Copy URL
                    </button>
                  </div>
                </React.Fragment>
              )}
            </div>
          </div>
        ))}
        <div className="column is-half">
          <div className={`${styles.card} ${styles.newCard}`} onClick={this.handleAddNew}>
            <div className={styles.newCardContent}>
              <img src={clipboardSvg} alt="Add new" style={{ width: 62 }} />
              <p>New Share URL</p>
            </div>
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
