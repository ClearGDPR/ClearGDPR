/* eslint react/prop-types: 0 */
import React from 'react';
import Elements from '@cleargdpr/elements';
import { wrap } from './DataErasureAwareContainer';

class Profile extends React.Component {
  render() {
    const ForgottenRequestButton = Elements.element({
      source: 'forgotten',
      className: 'button is-primary',
      label: 'Request to be forgotten'
    });

    const ExportDataButton = Elements.element({
      source: 'export',
      className: 'button is-primary',
      label: 'Export data'
    });

    const Objection = Elements.element({
      source: 'objection',
      label: 'Allow data processing'
    });

    const UserDataStatus = Elements.element({
      source: 'data'
    });

    const Rectification = Elements.element({
      source: 'rectification',
      label: 'Request rectification'
    });

    const Restriction = Elements.element({
      source: 'restriction',
      label: 'Restrict processing to controller'
    });

    return (
      <React.Fragment>
        <section className="section" id="erase-data">
          <div className="container">
            <div className="columns">
              <div className="column is-two-fifths">
                <h1 className="title">Right to rectification →</h1>
                <p>Article 16 GDPR Right to rectification</p>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://gdpr-info.eu/art-17-gdpr/"
                >
                  Go to GDPR article →
                </a>
              </div>
              <div className="column is-one-third">{Rectification}</div>
            </div>
          </div>
          <div className="container">
            <div className="columns">
              <div className="column is-two-fifths">
                <h1 className="title">Right to be forgotten →</h1>
                <p>Article 17 GDPR Right to erasure (‘right to be forgotten’)</p>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://gdpr-info.eu/art-17-gdpr/"
                >
                  Go to GDPR article →
                </a>
              </div>
              <div className="column is-one-third">{ForgottenRequestButton}</div>
            </div>
          </div>
        </section>
        <section className="section" id="object-data-processing">
          <div className="container">
            <div className="columns">
              <div className="column is-two-fifths">
                <h1 className="title">Right to object →</h1>
                <p>Article 21 GDPR Right to object</p>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://gdpr-info.eu/art-21-gdpr/"
                >
                  Go to GDPR article →
                </a>
              </div>
              <div className="column is-one-third">{Objection}</div>
            </div>
          </div>
        </section>
        <section className="section" id="export-data">
          <div className="container">
            <div className="columns">
              <div className="column is-two-fifths">
                <h1 className="title">Right to portability →</h1>
                <p>Article 20 GDPR Right to portability (‘right to export’)</p>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://gdpr-info.eu/art-20-gdpr/"
                >
                  Go to GDPR article →
                </a>
              </div>
              <div className="column is-one-third">{ExportDataButton}</div>
            </div>
          </div>
        </section>
        <section className="section" id="restrict-data-processing">
          <div className="container">
            <div className="columns">
              <div className="column is-two-fifths">
                <h1 className="title">Right to restriction of processing →</h1>
                <p>https://gdpr-info.eu/art-18-gdpr/</p>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://gdpr-info.eu/art-18-gdpr/"
                >
                  Go to GDPR article →
                </a>
              </div>
              <div className="column is-one-third">{Restriction}</div>
            </div>
          </div>
        </section>
        <section className="section" id="export-data">
          <div className="container">
            <div className="columns">
              <div className="column is-two-fifths">
                <h1 className="title">Right to access your data →</h1>
                <p>Art. 15 GDPR Right of access by the data subject</p>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://gdpr-info.eu/art-15-gdpr/"
                >
                  Go to GDPR article →
                </a>
              </div>
              <div className="column is-one-third">{UserDataStatus}</div>
            </div>
          </div>
        </section>
      </React.Fragment>
    );
  }
}

export default wrap(Profile);
