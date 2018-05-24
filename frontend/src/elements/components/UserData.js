import React from 'react';
import Elements from '../components/Elements';
import styles from '../theme/SubjectData.scss';

// Check if OG is initialized
Elements();

class UserData extends React.PureComponent {
  state = {
    data: null,
    status: null
  };

  componentDidMount() {
    // TODO: Improve cache, save to elements store, add localStorage
    setTimeout(() => {
      const cgToken = localStorage.getItem('cgToken');

      window.cg.setAccessToken(cgToken);
      window.cg.Subject.accessData()
        .then(data => {
          this.setState({ data });
        })
        .catch(err => {
          console.log('failure', err);
        });

      window.cg.Subject.getDataStatus()
        .then(status => {
          this.setState({ status });
        })
        .catch(err => {
          console.log('failure', err);
        });
    }, 1000);
  }

  render() {
    const { data, status } = this.state;

    if (!data || !status) {
      return <div>Loading</div>;
    }

    return (
      <div className={styles.data}>
        <b>Data shared: </b>
        <br />
        <ul>
          {Object.keys(data).map(field => (
            <li key={field}>
              <b>{field}</b>: {data[field]}
            </li>
          ))}
        </ul>
        <br />
        <b>Your data is shared with: </b>
        <div>Controller: {status.controller}</div>
        <br />
        <b>Processors</b>
        <ul>
          {status.processors.map(p => (
            <div key={p.id} className={styles.processor}>
              <span
                className={[styles.status, p.status ? styles.isActive : styles.isInactive].join(
                  ' '
                )}
              />
              <span>{p.id}</span>
            </div>
          ))}
        </ul>
      </div>
    );
  }
}

export default UserData;
