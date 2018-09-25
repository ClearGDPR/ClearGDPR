/* eslint react/prop-types: 0 */

import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { SubjectProvider } from '../Elements';

class App extends Component {
  state = {
    isLoggedIn: false
  };

  componentDidMount() {
    const isLoggedIn = !!localStorage.getItem('cgToken');
    this.setState({ isLoggedIn });
  }

  onClickLogout = () => {
    localStorage.removeItem('cgToken');
    window.location.assign('/login');
    this.setState({ isLoggedIn: false });
  };

  render() {
    const { props } = this;
    const isLoggedIn = !!localStorage.getItem('cgToken');

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
              {!isLoggedIn && [
                <div className="navbar-item" key="login">
                  <Link to="/login" className="navbar-item">
                    Sign in
                  </Link>
                </div>,
                <div className="navbar-item" key="signup">
                  <Link to="/sign-up" className="navbar-item">
                    Sign up
                  </Link>
                </div>
              ]}
            </div>
            <div className="navbar-end">
              {isLoggedIn && (
                <React.Fragment>
                  <div className="navbar-item">
                    <Link to="/shares" className="navbar-item">
                      Share your data
                    </Link>
                  </div>

                  <div className="navbar-item">
                    <Link to="/profile" className="navbar-item button is-primary">
                      Your data
                    </Link>
                  </div>

                  <div className="navbar-item">
                    <a onClick={this.onClickLogout} className="navbar-item button">
                      Log out
                    </a>
                  </div>
                </React.Fragment>
              )}
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
