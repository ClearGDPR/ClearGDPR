import React, { Component, createContext } from 'react';
import PropTypes from 'prop-types';

const PanelContext = createContext({
  component: null,
  title: null,
  props: {},
  openPanel: () => {},
  closePanel: () => {},
  isPanelOpen: false
});

export class PanelProvider extends Component {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.object,
      PropTypes.arrayOf(PropTypes.element)
    ])
  };

  openPanel = (component, title = null, props = {}) => {
    this.setState({
      component,
      title,
      isPanelOpen: true,
      props
    });
  };

  closePanel = () =>
    this.setState({
      component: null,
      title: null,
      isPanelOpen: false,
      props: {}
    });

  state = {
    component: null,
    title: null,
    props: {},
    openPanel: this.openPanel,
    closePanel: this.closePanel,
    isPanelOpen: false
  };

  render() {
    return <PanelContext.Provider value={this.state}>{this.props.children}</PanelContext.Provider>;
  }
}

export const PanelConsumer = PanelContext.Consumer;
