/* eslint react/prop-types: 0 */
import React from 'react';

import { Elements } from '../Elements';
import { wrap } from './DataErasureAwareContainer';

class Share extends React.Component {
  render() {
    const ShareData = Elements.element({
      source: 'share-data'
    });

    return (
      <React.Fragment>
        <section className="section" id="erase-data">
          <div className="container">
            <div className="columns">
              <div className="column is-one-fifth">
                <h1 className="title">Share your data →</h1>
                <p>GDPR Article 20</p>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://gdpr-info.eu/art-20-gdpr/"
                >
                  Go to GDPR article →
                </a>
              </div>
              <div className="column is-four-fifth">{ShareData}</div>
            </div>
          </div>
        </section>
      </React.Fragment>
    );
  }
}

export default wrap(Share);
