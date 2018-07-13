import React from 'react';
import PropTypes from 'prop-types';
import ItemsCard from 'components/core/cards/dashboard/ItemsCard';

const ConsentByProcessor = ({ processors, totalSubjects }) => {
  return (
    <ItemsCard
      data={processors.map(p => ({
        name: p.name,
        fillPercent: totalSubjects ? Math.floor(p.consented / totalSubjects * 100) : 100
      }))}
    />
  );
};

ConsentByProcessor.propTypes = {
  processors: PropTypes.array,
  totalSubjects: PropTypes.number
};

export default ConsentByProcessor;
