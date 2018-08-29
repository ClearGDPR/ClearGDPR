import React from 'react';
import PropTypes from 'prop-types';

import styles from 'theme/SubjectData.scss';
import Subject from 'contexts/Subject';

class UserData extends React.PureComponent {
  componentDidMount() {
    this.props.subject.fetchProcessors();
  }

  render() {
    const { data, status, processors } = this.props.subject;

    if (!data || !status || !processors) {
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
        {processors.map(p => (
          <div key={p.id} className={styles.processor}>
            <div>
              <img src={p.logoUrl} alt={p.name} style={{ height: 60 }} />
            </div>
            <div>{p.name}</div>
            <div>{p.description}</div>
            <div>
              <b>Status</b>: {p.status}
            </div>
          </div>
        ))}
      </div>
    );
  }
}

UserData.propTypes = {
  subject: PropTypes.instanceOf(Subject)
};

export default UserData;
