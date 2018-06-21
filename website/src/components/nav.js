import React from 'react';
import navLogo from './../assets/images/homepage-logo.png';
import githubIMG from './../assets/images/github.svg';

const Nav = () => {
  return (
    <React.Fragment>
      <nav className="container">
        <a href="/">
          <img className="logo" src={navLogo} alt="Clear GDPR logo" />
        </a>
        <div className="spacer" />
        <a href="https://demo.cleargdpr.com">Demo</a>
        <a href="https://docs.cleargdpr.com">Documentation</a>

        <a target="_blank" rel="noopener noreferrer" href="https://github.com/ClearGDPR/ClearGDPR">
          <img src={githubIMG} alt="github logo" />
        </a>
      </nav>
    </React.Fragment>
  );
};

export default Nav;
