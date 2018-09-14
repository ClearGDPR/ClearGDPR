import React from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';

import Icon from 'components/core/cards/dashboard/Icon';
import IconOverview from 'assets/icons/overview.svg';
import IconProcessors from 'assets/icons/processors.svg';
import dashLogo from 'assets/images/dash-logo.svg';

const Sidenav = props => {
  function handleLogoutClick(e) {
    e.preventDefault();
    props.onLogoutClick();
  }

  return (
    <nav className={props.isSidenavOpen ? 'sidenav' : 'sidenav closed'}>
      <NavLink to="/">
        <img className="dash-logo" src={dashLogo} alt="Clear logo" />
      </NavLink>
      <p>
        <small className="label">Main</small>
      </p>
      <NavLink exact to="/" activeClassName="active">
        <Icon name="overview" src={IconOverview} />Overview
      </NavLink>
      <NavLink to="/processors" activeClassName="active">
        <Icon name="processors" src={IconProcessors} />Processors
      </NavLink>
      <NavLink to="/rectifications">
        <i style={{ marginRight: '1rem', fontSize: 16 }} className="ui-action icon material-icons">
          done_all
        </i>Rectifications
      </NavLink>
      {/* <NavLink to="/data-attributes">Data attributes</NavLink> */}
      <NavLink to="/users">
        <i style={{ marginRight: '1rem', fontSize: 16 }} className="material-icons">
          supervised_user_circle
        </i>Users
      </NavLink>
      <p>
        <small className="label">Account</small>
      </p>
      <a href={'#logout'} onClick={handleLogoutClick}>
        <i style={{ marginRight: '1rem', fontSize: 16 }} className="ui-action icon material-icons">
          keyboard_backspace
        </i>
        Logout
      </a>
    </nav>
  );
};

Sidenav.propTypes = {
  isSidenavOpen: PropTypes.bool,
  onLogoutClick: PropTypes.func.isRequired
};

export default Sidenav;
