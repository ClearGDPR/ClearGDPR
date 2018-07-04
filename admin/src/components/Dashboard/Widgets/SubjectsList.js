import React from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';

import TableCard from 'components/core/cards/dashboard/TableCard';

const SubjectsList = ({ subjects, isLoading, errorState }) => {
  const header = ['id', 'firstname', 'email', 'consented_on'];
  // TODO: loading?1

  // once we start reaching into data here, this code becomes janky since data is not ours
  const rows = subjects.map(subject => {
    return {
      id: subject.id,
      consented_on: format(new Date(subject.createdAt), 'DD/MM/YYYY'),
      firstname: subject.data.firstname,
      email: subject.data.email
    };
  });
  return (
    <React.Fragment>
      <TableCard header={header} rows={rows} title="Subjects" />
    </React.Fragment>
  );
};

SubjectsList.propTypes = {
  subjects: PropTypes.array,
  isLoading: PropTypes.bool,
  errorState: PropTypes.bool
};

export default SubjectsList;
