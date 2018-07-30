import React from 'react';

export default event => (
  <React.Fragment>
    <p>
      <b>Event name</b> received from <b>Node name:</b>
    </p>
    <ul>
      <li>address: String, 32 Bytes - address from which this log originated.</li>
      <li>args: Object - The arguments coming from the event.</li>
      <li>
        blockHash: String, 32 Bytes - hash of the block where this log was in. null when its
        pending.
      </li>
      <li>blockNumber: Number - the block number where this log was in. null when its pending.</li>
      <li>logIndex: Number - integer of the log index position in the block.</li>
      <li>event: String - The event name.</li>
      <li>
        removed: bool - indicate if the transaction this event was created from was removed from the
        blockchain (due to orphaned block) or never get to it (due to rejected transaction).
      </li>
      <li>
        transactionIndex: Number - integer of the transactions index position log was created from.
      </li>
      <li>
        transactionHash: String, 32 Bytes - hash of the transactions this log was created from.
      </li>
    </ul>
  </React.Fragment>
);
