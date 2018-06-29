import React from 'react';
import PropTypes from 'prop-types';
import { Form, Text } from 'react-form';

import logo from 'assets/logo.png';
import 'theme/Login.css';
import 'theme/Forms.css';
import Loader from 'components/core/cards/dashboard/Loader';

const Errors = ({ errors }) => {
  if (!Object.keys(errors).length > 0) return null;

  return (
    <ul className="errors">
      {Object.keys(errors)
        .filter(e => !!errors[e])
        .map(e => <li key={e}>{errors[e]}</li>)}
    </ul>
  );
};

Errors.propTypes = {
  errors: PropTypes.object
};

class Login extends React.Component {
  state = {
    isLoading: false,
    errors: null
  };

  onLoginSubmit({ username, password }) {
    this.setState({ isLoading: true });
    this.props.auth(username, password).catch(err => {
      this.setState({
        isLoading: false,
        errors: { server: `There was a problem: ${err.message}` }
      });
    });
  }

  render() {
    return (
      <section className="login-section">
        <div className="login-card">
          {this.state.isLoading ? (
            <Loader />
          ) : (
            <React.Fragment>
              <img className="logo" src={logo} alt="Clear logo" />
              <Form onSubmit={values => this.onLoginSubmit(values)}>
                {({ submitForm, errors }) => (
                  <form onSubmit={submitForm}>
                    <Errors errors={{ ...this.props.errors, ...this.state.errors, ...errors }} />
                    <Text field="username" placeholder="Your username" validateOnSubmit required />
                    <Text
                      field="password"
                      type="password"
                      placeholder="*********"
                      validateOnSubmit
                      required
                    />
                    <button type="submit" className="btn">
                      Login
                    </button>
                  </form>
                )}
              </Form>
            </React.Fragment>
          )}
        </div>
      </section>
    );
  }
}

Login.propTypes = {
  errors: PropTypes.object,
  auth: PropTypes.func.isRequired
};

Login.defaultValues = {
  errors: {}
};

export default Login;
