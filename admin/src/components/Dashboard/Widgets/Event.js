import React from 'react';

export default ({ event }) => {
  const { eventName, from, fromName } = event;

  return (
    <React.Fragment>
      <p>
        <b>{eventName}</b> received from <b>{fromName}</b>:
      </p>
      <ul>
        <li>address: {from}</li>
        <li>args: Object - The arguments coming from the event.</li>
      </ul>
    </React.Fragment>
  );
};
