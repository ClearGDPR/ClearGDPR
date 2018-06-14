import React from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import Icon from './Icon';
import IconOverview from './../../../../assets/icons/overview.svg';
import IconProcessors from './../../../../assets/icons/processors.svg';
import dashLogo from './../../../../assets/images/dash-logo.svg';

import session from '../../../../helpers/Session';

const Sidenav = props => {
  // TODO: move when refactoring dashboard to presentational and container components
  const logout = () => {
    session.destroy();
    props.history.push('/');
  };

  function handleLogoutClick(e) {
    e.preventDefault();
    logout();
  }

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
      <a href="#" onClick={handleLogoutClick}>
        Logout
      </a>
    </nav>
  );
};

Sidenav.propTypes = {
  history: PropTypes.object.isRequired
};

export default withRouter(Sidenav);
