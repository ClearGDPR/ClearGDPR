import React from 'react';
import PropTypes from 'prop-types';

import Icon from './Icon';
import iconMenu from 'assets/icons/menu.svg';
import iconUser from 'assets/icons/user.svg';

const Header = props => {
  return (
    <React.Fragment>
      <header>
        <Icon src={iconMenu} name="Menu" action={props.onMenuClick} />
        <p>{props.title}</p>
        <div className="spacer" />
        <p className="hide-mobile">{props.greeting}</p>
        <Icon src={iconUser} name="User" />
      </header>
    </React.Fragment>
  );
};

Header.propTypes = {
  onMenuClick: PropTypes.func.isRequired,
  title: PropTypes.string,
  greeting: PropTypes.string
};

export default Header;
