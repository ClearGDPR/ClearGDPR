import React from 'react';
import Hero from '../components/hero';
import featuresIMG from './../assets/images/features.svg';
import globeIMG from './../assets/images/globe.svg';
import madIMG from './../assets/images/MADRed.svg';
import adledgerIMG from './../assets/images/adledger.svg';
import clevertechIMG from './../assets/images/clevertech.svg';

const Home = () => {
  return (
    <React.Fragment>
      <Hero />

      <section className="white">
        <div className="container" style={{ textAlign: 'center' }}>
          <h3>What is GDPR?</h3>
          <p>
            The EU General Data Protection Regulation (GDPR) replaces the Data Protection Directive
            95/46/EC and was designed to harmonize data privacy laws across Europe, to protect and
            empower all EU citizens data privacy and to reshape the way organizations across the
            region approach data privacy.
          </p>
        </div>
      </section>

      <section className="container separator">
        <div className="graphic">
          <img src={featuresIMG} alt="Abstract Blockchain Mechanics Graphic" />
        </div>
      </section>

      <section className="container">
        <div className="row">
          <article className="feature">
            <h3>
              <span>Blockchain Based</span>
            </h3>
            <p>
              Powered by blockchain technology, ensuring immutability and transparency while
              empowering organizations to allow users to truly own their data.
            </p>
          </article>
          <article className="feature">
            <h3>
              <span>Countless Data Adapters</span>
            </h3>
            <p>
              No matter what your stack is, ClearGDPR will work for your company. With an easily
              accessible plugin API, and countless data adapters already available for leading data
              stores and middlewares, you can be sure that there is a solution that will work for
              you.
            </p>
          </article>
        </div>

        <div className="row">
          <article className="feature">
            <h3>
              <span>Easy to deploy</span>
            </h3>
            <p>
              On-premise, in the cloud or installed via a partner as a SaaS, ClearGDPR is flexible
              for your infrastructure.
            </p>
          </article>
          <article className="feature">
            <h3>
              <span>Simple to customize</span>
            </h3>
            <p>
              With the ability to cleanly integrate into any site, ClearGDPR provides a powerful SDK
              that gives the ability to make the GDPR process easily and smoothly integrate into
              your site. All while maintaining the security and transparency of the ClearGDPR
              platform.
            </p>
          </article>
        </div>
      </section>

      <section className="container separator">
        <div className="graphic">
          <img style={{ width: '10%' }} src={globeIMG} alt="Green tech globe" />
        </div>
      </section>

      <section className="white">
        <div className="container center">
          <p className="center">
            <em>Powered by MAD</em>
          </p>
          <div className="support">
            <img className="madred" src={madIMG} alt="MadRed Logo" />
          </div>
          <div className="support">
            <img className="adledger" src={adledgerIMG} alt="Adledger Logo" />
          </div>
          <p>
            This project is an open-source initiative of the AdLedger Consortium, a New York based
            501(c)6, and proudly supported by Clevertech, a New York City based enterprise digital
            product development consultancy.
          </p>
          <div className="support">
            <img className="ct" src={clevertechIMG} alt="Clevertech Logo" />
          </div>
          <br />
          <a className="get-in-touch active" href="mailto:cleargdpr@adledger.com">
            Get in touch!
          </a>
        </div>
      </section>
      <footer className="center">
        <p>&copy;2018 ClearGDPR. </p>
      </footer>
    </React.Fragment>
  );
};

export default Home;
