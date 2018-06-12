import React from 'react';

export default class Login extends React.Component {
  state = {
    isLoading: false
  };

  onLogin(e, auth) {
    e.preventDefault();
    this.setState({ isLoading: true });
    auth.login(this.refs.email.value, this.refs.password.value);
  }

  render() {
    const { auth } = this.props;

    return (
      <form onSubmit={e => this.onLogin(e, auth)}>
        <input type="text" ref="email" placeholder="Your email" />
        <input type="password" ref="password" placeholder="*********" />
        <button type="submit" className={`button ${this.state.isLoading ? 'is-loading' : null}`}>
          Sign Up
        </button>
      </form>
    );
  }
}
