/* eslint react/prop-types: 0 */
import React, { Component } from 'react';

import config from '../config';
import { Elements } from '../Elements';

class SignUp extends Component {
  state = {
    isLoading: false,
    error: false
  };

  onSignUpHandler = e => {
    e.preventDefault();

    const { email, password } = this.refs;
    const url = config.API_BASE + '/api/users/register';

    this.setState({ isLoading: true });

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
      .then(res => res.json())
      .then(response => {
        this.setState({ isLoading: false });

        if (response.error) {
          this.setState({ error: response.error });
          return;
        }

        // Save token for future usages (logged in users)
        localStorage.setItem('cgToken', response.cgToken);
      })
      .catch(console.log);
  };

  render() {
    const ConsentFormController = Elements.element({
      source: 'consent',
      label: `The Sport Times would like to share your data with our partners.
      Let us know if you would like to have your data shared with partners by ticking the box and choosing which partners have your consent to access your data.
      You can choose how your data is used in your account area.
      `,

      styles: {
        label: {
          fontSize: '12px'
        }
      },
      required: true,
      onSuccessCallback: () => {
        this.props.history.push('/success');
      }
    });
    const { error } = this.state;

    return (
      <section className="section" id="give-consent">
        <div className="container">
          <div className="columns">
            <div className="column is-two-fifths">
              <h1 className="title">Right to consent processing →</h1>
              <p>GDPR Article 13</p>
              <a target="_blank" rel="noopener noreferrer" href="https://gdpr-info.eu/art-13-gdpr/">
                Go to GDPR article →
              </a>
            </div>
            <div className="column is-one-third">
              <h3 className="title"> Create your account </h3>
              <p>{`To create your account simply fill the short form below:`}</p>
              <hr />
              <form onSubmit={e => this.onSignUpHandler(e)}>
                {error && <div className="notification is-danger">{error}</div>}
                <div className="field">
                  <label className="label">First name</label>
                  <div className="control">
                    <input
                      className="input"
                      name="firstname"
                      type="text"
                      data-cleargdpr="true"
                      required
                    />
                  </div>
                </div>
                <div className="field">
                  <label className="label">Last name</label>
                  <div className="control">
                    <input
                      className="input"
                      name="lastname"
                      type="text"
                      data-cleargdpr="true"
                      required
                    />
                  </div>
                </div>
                <div className="field">
                  <label className="label">Website</label>
                  <div className="control">
                    <input
                      className="input"
                      name="website"
                      type="text"
                      data-cleargdpr="true"
                      required
                    />
                  </div>
                </div>
                <div className="field">
                  <label className="label">Your email address</label>
                  <div className="control">
                    <input
                      className="input"
                      name="email"
                      type="email"
                      ref="email"
                      data-cleargdpr="true"
                      required
                    />
                  </div>
                </div>
                <div className="field">
                  <label className="label">Your password</label>
                  <div className="control">
                    <input className="input" ref="password" name="password" type="password" />
                    <small>
                      {`It's important to use a secure password. You can create this with
                      any combination of 8 or more mixed letters, numbers or special
                      characters (*?£, etc).`}
                    </small>
                  </div>
                </div>
                <div className="field">
                  <label className="label">Confirm password</label>
                  <div className="control">
                    <input className="input" name="repeatpassword" type="password" />
                  </div>
                </div>

                {ConsentFormController}

                <br />
                <small>{`By registering with The Sport Times you agree to our Terms
                and Conditions and our Privacy Policy.`}</small>
                <br />
                <br />

                <button
                  type="submit"
                  className={`button is-primary ${this.state.isLoading ? 'is-loading' : ''}`}
                >
                  Register
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default SignUp;
