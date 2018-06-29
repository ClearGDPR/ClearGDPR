import React from 'react';
import { Link } from 'react-router-dom';
import logo from 'assets/images/logo.png';

const LoginCard = () => {
  return (
    <div className="login-card">
      <img className="logo" src={logo} alt="Clear logo" />
      <form>
        <input type="text" name="email" placeholder="your@email.com" />
        <input type="password" name="password" placeholder="*********" />
        <Link to="/dashboard/overview" className="btn">
          Login
        </Link>
      </form>
      <p>
        <small>Where am I?</small>
      </p>
    </div>
  );
};

export default LoginCard;
