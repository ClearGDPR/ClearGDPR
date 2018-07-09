import React from 'react';

import NumberCard from 'components/core/cards/dashboard/NumberCard';

const ConsentDial = () => {
  return (
    <NumberCard size={1} cols={1} data={{ number: 1, change: 2, title: 'New user consents' }} />
  );
};

export default ConsentDial;
