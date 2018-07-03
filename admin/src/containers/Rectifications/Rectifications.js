import React from 'react';
import Rectifications from 'components/Rectifications/Rectifications';

export class RectificationsContainer extends React.Component {
  static propTypes = {};

  render() {
    return <Rectifications tabs={['tab1', 'tab2']} selectedTab={0} />;
  }
}

export default RectificationsContainer;
