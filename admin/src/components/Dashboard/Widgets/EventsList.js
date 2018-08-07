import React from 'react';
import PropTypes from 'prop-types';
import format from 'helpers/date-formatter';
import TableCard from 'components/core/cards/dashboard/TableCard';
import Event from './Event';

const EventsList = ({ events, connected, errorState }) => {
  const columns = {
    event: { title: 'Event' },
    date: { title: 'Date' }
  };

  const rows = events.map(eventData => ({
    event: <Event event={eventData} />,
    date: format(eventData.time)
  }));

  let tag;
  if (connected) {
    tag = <span className="tag is-info">Connected</span>;
  } else if (errorState) {
    tag = <span className="tag is-danger">Connection error</span>;
  } else {
    tag = <span className="tag is-light">Disconnected</span>;
  }

  return <TableCard columns={columns} rows={rows} title={<p>Events {tag}</p>} />;
};

EventsList.propTypes = {
  events: PropTypes.array,
  connected: PropTypes.bool,
  errorState: PropTypes.bool
};

export default EventsList;
