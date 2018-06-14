import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import logo from '../../assets/logo.png';
import Login from '../../components/Login/Login';
import session from '../../helpers/Session';
import config from '../../config';
import '../../theme/Login.css';

const LoginContainer = withRouter(props => {
  const { from } = props.location.state || { from: { pathname: '/' } };
  const { history } = props;

  const handleLogin = (username, password) => {
    fetch(`${config.API_URL}/api/management/users/login`, {
      method: 'POST',
      body: JSON.stringify({
        username,
        password
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(async res => {
        session.set(await res.json());
        history.push(from);
      })
      .catch(err => {
        return err;
      });
  };

  return (
    <section className="login-section">
      <div className="login-card">
        <img className="logo" src={logo} alt="Clear logo" />
        <Login auth={handleLogin} />
      </div>
    </section>
  );
});

LoginContainer.propTypes = {
  location: PropTypes.object
};

export default LoginContainer;
