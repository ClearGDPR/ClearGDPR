import React from 'react';
import Particles from 'react-particles-js';
import logoISO from './../assets/images/logo-iso.svg';
import scrollIMG from './../assets/images/down.svg';

const Hero = () => {
  return (
    <React.Fragment>
      <section className="hero row container">
        <div className="graphic fade-up">
          <img className="hero-img" src={logoISO} alt="Clear GDPR Logo" />
        </div>
        <div className="content fade-down">
          <h1>
            The Leading GDPR Compliance Solution: <br /> Open Source, Blockchain Based.
          </h1>
          <p>
            Regardless of your data stores, ClearGDPR allows you to install on-premise or in the
            cloud, a complete web based GDPR compliance tool, with Blockchain anchored
            chain-of-custody records.
          </p>
        </div>
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
            opacity: '0.5'
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
        <div className="scroll-down">
          <img src={scrollIMG} alt="scroll down cta" />
        </div>
      </section>
    </React.Fragment>
  );
};

export default Hero;
