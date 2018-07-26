/* eslint react/prop-types: 0 */
import React from 'react';

import Elements from '../Elements';
import { inject } from './SubjectContext';
import LoadingScreen from '../Elements/components/Common/Views/LoadingScreen';
import DataErasedScreen from '../Elements/components/Common/Views/DataErasedScreen';

class Share extends React.Component {
  componentDidMount() {
    this.props.subject.fetchData();
  }
  render() {
    const ShareData = Elements.element({
      source: 'share-data'
    });

    const { subject } = this.props;

    if (subject.isGuest) {
      this.props.history.push('/sign-up');
    }

    if (!subject.isFetched) {
      return <LoadingScreen />;
    }

    if (subject.isErased) {
      return <DataErasedScreen />;
    }

    return (
      <React.Fragment>
        <section className="section" id="erase-data">
          <div className="container">
            <div className="columns">
              <div className="column is-one-fifth">
                <h1 className="title">Share your data →</h1>
                <p>Article 20 GDPR Right to data portability</p>
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

export default inject(Share);
