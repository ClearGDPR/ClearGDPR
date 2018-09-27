/* eslint react/prop-types: 0 */
import React, { Component } from 'react';
import config from '../config';

const { API_BASE } = config;

class Login extends Component {
  state = {
    isLoading: false
  };

  onLoginHandler = e => {
    e.preventDefault();
    this.setState({ isLoading: true });

    const { email, password } = this.refs;
    const url = API_BASE + '/api/users/login';

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: email.value,
        password: password.value
      })
    })
      .then(res => {
        if (res.ok) return res;
        throw new Error(`Invalid credentials`);
      })
      .then(res => res.json())
      .then(token => {
        this.setState({ isLoading: false });
        localStorage.setItem('cgToken', token.cgToken);
        this.props.history.push('/profile');
      })
      .catch(e => {
        console.log('e', e);
        this.setState({
          isLoading: false,
          error: 'Invalid Credentials'
        });
      });
  };

  render() {
    return (
      <section className="section" id="give-consent">
        <div className="container">
          <div className="columns">
            <div className="column is-one-third">
              <h3 className="title"> Sign in to your account </h3>
              <hr />
              <form onSubmit={this.onLoginHandler}>
                {this.state.error && <label style={{ color: 'red' }}>{this.state.error}</label>}
                <div className="field">
                  <label className="label">Email</label>
                  <div className="control">
                    <input className="input" ref="email" type="email" required />
                  </div>
                </div>
                <div className="field">
                  <label className="label">Your Password</label>
                  <div className="control">
                    <input className="input" ref="password" type="password" />
                  </div>
                </div>

                <button
                  type="submit"
                  className={`button is-primary ${this.state.isLoading ? 'is-loading' : ''}`}
                >
                  Sign in
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default Login;
