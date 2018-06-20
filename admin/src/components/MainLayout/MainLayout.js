import React from 'react';
import PropTypes from 'prop-types';

import Sidenav from '../../containers/Sidenav/Sidenav';
import Header from '../core/cards/dashboard/Header';
import Panel from '../core/cards/dashboard/Panel';

import './styles.css';

class MainLayout extends React.Component {
  static propTypes = {
    isSidenavOpen: PropTypes.bool.isRequired,
    isPanelOpen: PropTypes.bool.isRequired,
    username: PropTypes.string.isRequired,
    onMenuClick: PropTypes.func.isRequired,
    onOverlayClick: PropTypes.func.isRequired,
    onClosePanelClick: PropTypes.func.isRequired,
    content: PropTypes.element.isRequired,
    panelTitle: PropTypes.string,
    panelContent: PropTypes.oneOfType([PropTypes.element, PropTypes.object, PropTypes.string])
  };

  eventHandler(e) {
    e.preventDefault();
    this();
  }

  render() {
    return (
      <main className="dashboard">
        {this.props.isPanelOpen ? (
          <section
            className="overlay"
            onClick={
              this.props.onOverlayClick
                ? this.eventHandler.bind(this.props.onOverlayClick)
                : () => {}
            }
          />
        ) : null}
        <Sidenav isSidenavOpen={this.props.isSidenavOpen} />
        <section className="content">
          <Header
            onMenuClick={this.eventHandler.bind(this.props.onMenuClick)}
            title="GDPR Advanced Tools"
            greeting={`Welcome ${this.props.username}`}
          />
          {this.props.content}
          <Panel
            isPanelOpen={this.props.isPanelOpen}
            onCloseClick={this.eventHandler.bind(this.props.onClosePanelClick)}
            title={this.props.panelTitle}
            content={this.props.panelContent}
          />
        </section>
      </main>
    );
  }
}

export default MainLayout;
