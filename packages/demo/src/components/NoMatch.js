/* eslint react/prop-types: 0 */

import React, { Component } from 'react';

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

export default NoMatch;
