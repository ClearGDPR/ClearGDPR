import React from 'react';
import PropTypes from 'prop-types';

import logo from '../../assets/logo.png';
import '../../theme/Login.css';

class Login extends React.Component {
  state = {
    isLoading: false
  };

  onLoginSubmit(e, auth) {
    e.preventDefault();
    this.setState({ isLoading: true });
    auth(this.refs.username.value, this.refs.password.value);
  }

  render() {
    const { auth } = this.props;

    return (
      <section className="login-section">
        <div className="login-card">
          <img className="logo" src={logo} alt="Clear logo" />
          <form onSubmit={e => this.onLoginSubmit(e, auth)}>
            <input type="text" ref="username" placeholder="Your username" />
            <input type="password" ref="password" placeholder="*********" />
            <button type="submit" className="btn ui-action">
              Login
            </button>
          </form>
        </div>
      </section>
    );
  }
}

Login.propTypes = {
  auth: PropTypes.func.isRequired
};

export default Login;
