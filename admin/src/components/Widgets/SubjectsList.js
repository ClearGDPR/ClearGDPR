import React from 'react';
import PropTypes from 'prop-types';

import TableCard from 'components/core/cards/dashboard/TableCard';

const SubjectsList = ({ subjects, isLoading, errorState }) => {
  const header = ['id', 'name', 'email', 'state'];
  // TODO: loading?
  return (
    <React.Fragment>
      <TableCard header={header} rows={subjects} title="Subjects" />
    </React.Fragment>
  );
};

SubjectsList.propTypes = {
  subjects: PropTypes.array,
  isLoading: PropTypes.bool,
  errorState: PropTypes.bool
};

export default SubjectsList;
