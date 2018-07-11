import React from 'react';

import GraphCard from 'components/core/cards/dashboard/GraphCard';
import PropTypes from 'prop-types';

const ConsentDial = ({ consented, unconsented }) => {
  const consentedPercent = consented + unconsented ? (consented + unconsented) * 100 : 100;
  return (
    <GraphCard
      title={'Consented Vs Not Consented Subjects'}
      text={`${consentedPercent}% of subjects have consented`}
      cols={2}
      data={[{ y: consented, x: 'Consented' }, { y: unconsented, x: 'Not Consented' }]}
    />
  );
};

ConsentDial.propTypes = {
  consented: PropTypes.number,
  unconsented: PropTypes.number
};

export default ConsentDial;
