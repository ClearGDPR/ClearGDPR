import React, { Component } from 'react';
import config from '../config';

const { API_BASE } = config;

class Login extends Component {
  async onSubmit(e) {
    e.preventDefault();
    const { email, password } = this.refs;
    const url = API_BASE + '/api/users/login';
    const token = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: email.value,
        password: password.value
      })
    }).then(res => res.json());

    localStorage.setItem('cgToken', token.cgToken);

    this.props.history.push('/profile');
  }

  render() {
    return (
      <section className="section" id="give-consent">
        <div className="container">
          <div className="columns">
            <div className="column is-one-third">
              <h3 className="title"> Sign in to your account </h3>
              <hr />
              <form onSubmit={this.onSubmit.bind(this)}>
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

                <input type="submit" value="Sign in" className="button is-primary" />
              </form>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

Login.propTypes = {};
export default Login;
