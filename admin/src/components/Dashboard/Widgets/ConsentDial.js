import React from 'react';
import PropTypes from 'prop-types';
import GraphCard from 'components/core/cards/dashboard/GraphCard';

const ConsentDial = ({ consented, unconsented }) => {
  const total = consented + unconsented;
  const consentedPercent = total ? Math.round((consented / total) * 100) : 100;
  return (
    <GraphCard
      title={'Consented vs Not Consented Subjects'}
      text={`${consentedPercent}% of subjects have consented`}
      cols={2}
      data={[{ y: consented, x: 'Consented' }, { y: unconsented, x: 'Not Consented' }]}
      labelFontSize={3}
    />
  );
};

ConsentDial.propTypes = {
  consented: PropTypes.number,
  unconsented: PropTypes.number
};

export default ConsentDial;
