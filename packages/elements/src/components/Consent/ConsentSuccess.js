import React from 'react';
import { Link } from 'react-router-dom';

import styles from '../../theme/Success.scss';

// TODO: Convert this to a callback screen, or move to a wrapper
const ConsentSuccess = () => {
  return (
    <div className={styles.container}>
      <div className={styles.success}>
        <h2 className={styles.title}>You're GDPR protected!</h2>
        <p className={styles.about}>{`
          Now you can manage your data and which processors access to it from the ClearGDPR
        `}</p>
        <Link to="/profile">
          <button className="button is-primary is-medium">Manage your data</button>
        </Link>
        <img
          alt="ClearGDPR"
          src="/logox500.png"
          style={{
            height: '25px',
            position: 'absolute',
            margin: '0 auto',
            left: 0,
            right: 0,
            bottom: '40px'
          }}
        />
      </div>
    </div>
  );
};

export default ConsentSuccess;
