import React from 'react';

export default class SignUp extends React.PureComponent {
  state = {
    isLoading: false,
    name: null,
    email: null,
    password: null
  };

  onSignUp(e) {
    e.preventDefault();
    this.setState({ isLoading: true });
    fetch('/management/users/register', {
      method: 'POST',
      body: JSON.stringify({
        name: this.state.name,
        email: this.state.email,
        password: this.state.password
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        this.setState({ isLoading: false });
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    const { state } = this;

    return (
      <form onSubmit={e => this.onSignUp(e)}>
        <input type="text" ref="name" value={state.name} placeholder="Full Name" />
        <input type="text" ref="email" value={state.email} placeholder="Your email" />
        <input type="password" ref="password" value={state.password} placeholder="*********" />
        <button type="submit" className={`button ${state.isLoading ? 'is-loading' : ''}`}>
          Sign Up
        </button>
      </form>
    );
  }
}
