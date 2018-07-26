import React from 'react';
import ModalView from './Modal';
import styles from '../../../theme/ForgottenRequest.scss';

export default () => (
  <React.Fragment>
    <ModalView open={true} onClose={() => null}>
      <div className={styles.container}>
        <div className={styles.full}>
          <h2 className={styles.heading}>Data is being loaded</h2>
        </div>
      </div>
    </ModalView>
  </React.Fragment>
);
