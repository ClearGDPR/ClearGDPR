import React from 'react';
import ReactDOM from 'react-dom';
import Element from './Element';
import ElementsContainer from './containers/Elements';

export default class Elements {
  static el;

  static mount() {
    const component = <ElementsContainer />;

    function doRender() {
      if (Elements.el) {
        throw new Error('Elements is already mounted, unmount first');
      }

      const el = document.createElement('div');
      document.body.appendChild(el);
      ReactDOM.render(component, el);
      Elements.el = el;
    }
    if (document.readyState === 'complete') {
      doRender();
      } else {
      window.addEventListener('load', () => {
        doRender();
      });
    }
  }

  static unmount() {
    if (!Elements.el) {
      throw new Error('Elements is not mounted, mount first');
    }
    ReactDOM.unmountComponentAtNode(Elements.el);
    Elements.el.parentNode.removeChild(Elements.el);
    Elements.el = null;
  }

  /**
   * Return a new Element
   */
  element(elementOptions) {
    return Element.create({ ...elementOptions });
  }
}

export default new Elements();
