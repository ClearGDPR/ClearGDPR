import React from 'react';
import logo from '../../assets/logo.png';
import Login from '../../components/Login/Login';
import Auth from './Auth';
import '../../theme/Login.css';

const auth = new Auth();

const LoginContainer = () => (
  <section className="login-section">
    <div className="login-card">
      <img className="logo" src={logo} alt="Clear logo" />
      <Login auth={auth} />
    </div>
  </section>
);

export default LoginContainer;
