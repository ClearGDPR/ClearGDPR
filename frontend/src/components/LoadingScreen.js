import React from 'react';

export default () => (
  <div id="modal" className="modal is-active">
    <div className="modal-background" />
    <div
      className="modal-content"
      style={{ textAlign: 'center', color: '#00d1b2', overflow: 'hidden' }}
    >
      <i className="fas fa-spinner fa-pulse fa-3x" />
    </div>
  </div>
);
