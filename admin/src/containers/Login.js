import React from 'react';
import logo from '../assets/logo.png';
import SignUp from '../components/Login/SignUp';
import '../theme/Login.css';

const LoginContainer = () => (
  <section className="login-section">
    <div className="login-card">
      <img className="logo" src={logo} alt="Clear logo" />
      <SignUp />
    </div>
  </section>
);

export default LoginContainer;
