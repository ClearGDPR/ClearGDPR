import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import Sidenav from 'components/Sidenav/Sidenav';
import { toast } from 'react-toastify';

import session from 'helpers/Session';

const SidenavContainer = props => {
  const logout = () => {
    session.destroy();
    toast.success('Logged out successfully');
    props.history.push('/');
  };

  return <Sidenav onLogoutClick={logout} isSidenavOpen={props.isSidenavOpen} />;
};

SidenavContainer.propTypes = {
  isSidenavOpen: PropTypes.bool.isRequired,
  history: PropTypes.object.isRequired
};

export default withRouter(SidenavContainer);
