import React from 'react';
import Icon from './Icon';
import iconMenu from './../../../../assets/icons/menu.svg';
import iconUser from './../../../../assets/icons/user.svg';

const Header = props => {
  return (
    <React.Fragment>
      <header>
        <Icon src={iconMenu} name="Menu" action={props.toggleSidenav} />
        <p>{props.title}</p>
        <div className="spacer" />
        <p className="hide-mobile">{props.greeting}</p>
        <Icon src={iconUser} name="User" />
      </header>
    </React.Fragment>
  );
};

export default Header;
