import React from 'react';
import Particles from 'react-particles-js';
import LoginCard from 'components/core/cards/LoginCard';
import './login.css';

const Login = () => {
  return (
    <section className="login-section">
      <LoginCard />
      <Particles
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          pointerEvents: 'none',
          zIndex: '-100',
          opacity: '1'
        }}
        params={{
          particles: {
            dots: {
              color: '#82efa6'
            },
            line_linked: {
              color: '#82efa6'
            }
          }
        }}
      />
    </section>
  );
};

export default Login;
