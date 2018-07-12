import React from 'react';
import PropTypes from 'prop-types';
import lodash from 'lodash';
import { UsersProvider } from 'containers/Users/UsersContext';
import { ProcessorsProvider } from 'containers/Processors/ProcessorsContext';
import { PanelProvider } from 'containers/MainLayout/PanelContext';
import { RectificationsProvider } from 'containers/Rectifications/RectificationsContext';
import { StatsProvider } from 'containers/Dashboard/StatsContext';

export const withWrapper = Wrapper => Component => {
  let wrapper = props => (
    <Wrapper>
      <Component {...props}>{props.children}</Component>
    </Wrapper>
  );
  wrapper.propTypes = {
    children: PropTypes.node
  };
  return wrapper;
};

export const withContextProviders = lodash.flow.apply(null, [
  withWrapper(UsersProvider),
  withWrapper(ProcessorsProvider),
  withWrapper(RectificationsProvider),
  withWrapper(PanelProvider),
  withWrapper(StatsProvider)
]);
