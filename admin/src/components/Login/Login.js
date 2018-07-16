import React from 'react';
import PropTypes from 'prop-types';
import { Form, Text } from 'informed';

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
  onLoginSubmit({ username, password }) {
    this.props.auth(username, password);
  }

  render() {
    return (
      <section className="login-section">
        <div className="login-card">
          {this.props.isLoading ? (
            <Loader />
          ) : (
            <React.Fragment>
              <img className="logo" src={logo} alt="Clear logo" />
              <Form onSubmit={values => this.onLoginSubmit(values)}>
                {({ errors }) => (
                  <React.Fragment>
                    <Errors errors={{ ...this.props.errors, ...errors }} />
                    <Text field="username" placeholder="Your username" required />
                    <Text field="password" type="password" placeholder="*********" required />
                    <button type="submit" className="btn">
                      Login
                    </button>
                  </React.Fragment>
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
  auth: PropTypes.func.isRequired,
  isLoading: PropTypes.bool
};

Login.defaultProps = {
  errors: {}
};

export default Login;
