import React from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';

import Icon from '../../components/core/cards/dashboard/Icon';
import IconOverview from '../../assets/icons/overview.svg';
import IconProcessors from '../../assets/icons/processors.svg';
import dashLogo from '../../assets/images/dash-logo.svg';

const Sidenav = props => {
  function handleLogoutClick(e) {
    e.preventDefault();
    props.handleLogoutClick();
  }

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
      <NavLink to="/processors" activeClassName="active">
        <Icon name="processors" src={IconProcessors} />Processors
      </NavLink>
      <NavLink to="/users">Loader</NavLink>
      <p>
        <small className="label">Account</small>
      </p>
      <NavLink to="/users">Profile</NavLink>
      <a href="#" onClick={handleLogoutClick}>
        Logout
      </a>
    </nav>
  );
};

Sidenav.propTypes = {
  isSidenavOpen: PropTypes.bool,
  handleLogoutClick: PropTypes.func.isRequired
};

export default Sidenav;
