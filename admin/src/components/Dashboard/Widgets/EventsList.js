import React from 'react';
import PropTypes from 'prop-types';
import format from 'helpers/date-formatter';
import TableCard from 'components/core/cards/dashboard/TableCard';
import Event from './Event';

const EventsList = ({ events, isLoading, errorState }) => {
  const columns = {
    event: { title: 'Event' },
    date: { title: 'Date' }
  };

  // TODO: loading?1

  const rows = events.map(eventData => ({
    event: <Event event={eventData} />,
    date: format(eventData.time)
  }));

  return <TableCard columns={columns} rows={rows} title="Events" />;
};

EventsList.propTypes = {
  events: PropTypes.array,
  isLoading: PropTypes.bool,
  errorState: PropTypes.bool
};

export default EventsList;
