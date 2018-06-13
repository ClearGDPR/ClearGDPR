import React from 'react';
import PropTypes from 'prop-types';

class Login extends React.Component {
  state = {
    isLoading: false
  };

  onLogin(e, auth) {
    e.preventDefault();
    this.setState({ isLoading: true });
    auth(this.refs.email.value, this.refs.password.value);
  }

  render() {
    const { auth } = this.props;

    return (
      <form onSubmit={e => this.onLogin(e, auth)}>
        <input type="text" ref="email" placeholder="Your email" />
        <input type="password" ref="password" placeholder="*********" />
        <button type="submit" className="btn ui-action">
          Login
        </button>
      </form>
    );
  }
}

Login.propTypes = {
  auth: PropTypes.func.isRequired
};

export default Login;
