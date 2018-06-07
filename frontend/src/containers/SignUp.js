import React, { Component } from 'react';

// CG Dependencies
import Element from '../elements/components/Element';
import Elements from '../elements/components/Elements';
Elements();

class SignUp extends Component {
  state = {
    isLoading: false
  };

  onSubmit(e) {
    e.preventDefault();
    this.setState({ isLoading: true });
    // This timeout is just for demo purpose, to give the user a visual feedback
    // when the form is sent. In localhost the transaction happens to fast in the
    // backend and user is redirected automatically, and cannot see the spinner.
    setTimeout(() => {
      // TODO: forcing the redirect after the form is processed.
      // Usually a form in a Client side is pointing to some endpoint to process
      // data sent by the user. Since we are handling part of that with the
      // `GiveConsent` component we should allow the developer to point to specific
      // callback.
      window.location = '/success';
    }, 1000);

    // Prevent to send data to default action. This interaction should be improved.
    return false;
  }

  render() {
    const ConsentFormController = Element.create({
      source: 'consent',
      label: `The Sport Times would like to 
      keep you informed about other offers, promotions and
      services that might interest you by email. Let us know if you would
      like to hear from us by ticking the box.`,
      styles: {
        label: {
          fontSize: '12px'
        }
      },
      callbackUrl: '/success',
      required: true
    });

    return (
      <section className="section" id="give-consent">
        <div className="container">
          <div className="columns">
            <div className="column is-two-fifths">
              <h1 className="title">Give Consent →</h1>
              <p>Article 13 GDPR Right to restriction of processing</p>
              <a target="_blank" rel="noopener noreferrer" href="https://gdpr-info.eu/art-13-gdpr/">
                Go to GDPR article →
              </a>
            </div>
            <div className="column is-one-third">
              <h3 className="title"> Create your account </h3>
              <p>{`To create your Account simply fill the short form below`}</p>
              <hr />
              <form onSubmit={e => this.onSubmit(e)}>
                <div className="field">
                  <label className="label">First Name</label>
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
                      data-cleargdpr="true"
                      required
                    />
                  </div>
                </div>
                <div className="field">
                  <label className="label">Your Password</label>
                  <div className="control">
                    <input className="input" name="password" type="password" />
                    <small>
                      {`It's important to use a secure password. You can create this with
                      any combination of 8 or more mixed letterS, numbers or special
                      characters (*?£, etc).`}
                    </small>
                  </div>
                </div>
                <div className="field">
                  <label className="label">Confirm Password</label>
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
                  Save my details
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

SignUp.propTypes = {};
export default SignUp;
