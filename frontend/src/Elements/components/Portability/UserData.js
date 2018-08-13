import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import styles from '../../theme/SubjectData.scss';
import Subject from '../../contexts/Subject';

const SUBJECT_DATA_STATUS = ['Unconsented', 'Consented', 'Erased'];

class UserData extends React.PureComponent {
  componentDidMount() {
    this.props.subject.fetchProcessors();
  }

  render() {
    const { data, status, processors } = this.props.subject;

    if (!data || !status) {
      return <div>Loading</div>;
    }

    let processorsList = [];

    if (processors && status.processors) {
      processorsList = processors.map(p => {
        const s = _.find(status.processors, { id: p.id });
        p.status = SUBJECT_DATA_STATUS[s.status];
        return p;
      });
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
        {processorsList.map(p => (
          <div key={p.id} className={styles.processor}>
            <div>
              <img src={p.logoUrl} alt={p.name} />
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
