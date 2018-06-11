import React from 'react';

export default class NoMatch extends React.Component {
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
