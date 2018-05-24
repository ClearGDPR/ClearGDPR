import React from 'react';
// CG Dependencies
import Element from '../elements/components/Element';
import Elements from '../elements/components/Elements';
Elements();

class Profile extends React.Component {
  render() {
    const ForgottenRequestButton = Element.create({
      source: 'forgotten',
      className: 'button is-primary',
      label: 'Request to be forgotten'
    });

    const ExportDataButton = Element.create({
      source: 'export',
      className: 'button is-primary',
      label: 'Export data'
    });

    const UserDataStatus = Element.create({
      source: 'data'
    });

    return (
      <React.Fragment>
        <section className="section" id="erase-data">
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

Profile.propTypes = {};
export default Profile;
