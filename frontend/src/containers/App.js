/* eslint react/prop-types: 0 */

import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { SubjectProvider } from '@cleargdpr/elements';

class App extends Component {
  render() {
    const { props } = this;
    const isGuest = !localStorage.getItem('cgToken');
    return (
      <SubjectProvider>
        <nav className="navbar is-white" aria-label="main navigation">
          <div className="navbar-brand">
            <Link className="navbar-item" to="/">
              <img alt="clevertech" src="/the_clevertech_times.png" style={{ width: '174px' }} />
            </Link>
          </div>
          <div className="navbar-menu">
            <div className="navbar-start">
              {isGuest
                ? [
                    <div className="navbar-item" key="login">
                      <Link to="/login" className="navbar-item">
                        Login
                      </Link>
                    </div>,
                    <div className="navbar-item" key="signup">
                      <Link to="/sign-up" className="navbar-item">
                        Sign up
                      </Link>
                    </div>
                  ]
                : null}
              <div className="navbar-item">
                <Link to="/shares" className="navbar-item">
                  Shares
                </Link>
              </div>
            </div>
            <div className="navbar-end">
              <div className="navbar-item">
                {props.user && (
                  <div className="field is-grouped">
                    <p className="control">
                      <a className="navbar-item">Hi {props.user.username}</a>
                    </p>
                    <p className="control">
                      <Link to="/account" className="navbar-item button is-primary">
                        Account
                      </Link>
                    </p>
                    <p>
                      <a onClick={props.logout} className="navbar-item button">
                        Log Out
                      </a>
                    </p>
                  </div>
                )}
                {!props.user && (
                  <div className="field is-grouped">
                    <p className="control">
                      <Link to="/profile" className="navbar-item button is-primary">
                        Your data
                      </Link>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>
        <div className="hero" style={{ background: '#fafafa' }}>
          <div className="hero-body">
            <div className="container">
              <h2 className="title">
                <span style={{ fontSize: '17px' }}>Demo powered by&nbsp;</span>
                <a href="https://www.cleargdpr.com/">
                  <img
                    src="/logox500.png"
                    alt="cleargdpr"
                    style={{ top: '4px', height: '20px', position: 'relative' }}
                  />
                </a>
              </h2>
            </div>
          </div>
        </div>

        {props.children}
      </SubjectProvider>
    );
  }
}

export default App;
