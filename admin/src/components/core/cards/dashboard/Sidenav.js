import React from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import Icon from './Icon';
import IconOverview from 'assets/icons/overview.svg';
import IconProcessors from 'assets/icons/processors.svg';
import dashLogo from 'assets/images/dash-logo.svg';

const Sidenav = props => {
  return (
    <nav className={props.isSidenavOpen ? 'sidenav' : 'sidenav closed'}>
      <NavLink to="/kitchen-sink/overview">
        <img className="dash-logo" src={dashLogo} alt="Clear logo" />
      </NavLink>
      <p>
        <small className="label">Main</small>
      </p>
      <NavLink to="/kitchen-sink/overview" activeClassName="active">
        <Icon name="overview" src={IconOverview} />Overview
      </NavLink>
      <NavLink to="/kitchen-sink/processors" activeClassName="active">
        <Icon name="processors" src={IconProcessors} />Processors
      </NavLink>
      <p>
        <small className="label">Account</small>
      </p>
      <NavLink to="/kitchen-sink/elements" activeClassName="active">
        Elements
      </NavLink>
      <NavLink to="/kitchen-sink/loader">Loader</NavLink>
    </nav>
  );
};

Sidenav.propTypes = {
  isSidenavOpen: PropTypes.bool
};

export default withRouter(Sidenav);
