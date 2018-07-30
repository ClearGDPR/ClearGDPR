import React from 'react';
import PropTypes from 'prop-types';
import format from 'helpers/date-formatter';
import TableCard from 'components/core/cards/dashboard/TableCard';
import Event from './Event';

const EventsList = ({ subjects, isLoading, errorState }) => {
  const columns = {
    event: { title: 'Event' },
    date: { title: 'Date' }
  };

  // TODO: loading?1

  // Once we start reaching into data here, this code becomes janky since data is not ours
  /*const rows = subjects.map(subject => {
    return {
      event: 'test'
    };
  });*/
  const rows = [{ event: <Event />, date: format(new Date()) }];

  return <TableCard columns={columns} rows={rows} title="Events" />;
};

EventsList.propTypes = {
  subjects: PropTypes.array,
  isLoading: PropTypes.bool,
  errorState: PropTypes.bool
};

export default EventsList;
