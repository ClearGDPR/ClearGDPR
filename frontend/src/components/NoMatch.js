import React, { Component } from 'react';

const propTypes = {};

class NoMatch extends Component {
  render() {
    return (
      <div>
        <div className="hero is-link">
          <div className="hero-body">
            <div className="container">
              <h2 className="title">Page not found</h2>
            </div>
          </div>
        </div>
        <section className="section">
          <div className="container">
            <p>¯\_(ツ)_/¯</p>
          </div>
        </section>
      </div>
    );
  }
}

NoMatch.propTypes = propTypes;
export default NoMatch;
