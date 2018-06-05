import React from 'react';
import { NavLink } from 'react-router-dom';
import Icon from './Icon';
import IconOverview from './../../assets/icons/overview.svg';
import IconProcessors from './../../assets/icons/processors.svg';
import dashLogo from './../../assets/images/dash-logo.svg';

const Sidenav = props => {
  return (
    <nav className={props.isSidenavOpen ? 'sidenav' : 'sidenav closed'}>
      <NavLink to="/dashboard/overview">
        <img className="dash-logo" src={dashLogo} alt="Clear logo" />
      </NavLink>
      <p>
        <small className="label">Main</small>
      </p>
      <NavLink to="/dashboard/overview" activeClassName="active">
        <Icon name="overview" src={IconOverview} />Overview
      </NavLink>
      <NavLink to="/dashboard/processors" activeClassName="active">
        <Icon name="processors" src={IconProcessors} />Processors
      </NavLink>
      <p>
        <small className="label">Account</small>
      </p>
      <NavLink to="/dashboard/preferences">Preferences</NavLink>
      <NavLink to="/" exact>
        Logout
      </NavLink>
    </nav>
  );
};

export default Sidenav;
