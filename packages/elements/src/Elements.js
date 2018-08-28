import Element from './Element';

class Elements {
  /**
   * Mount Elements SDK for all HTML tags defined in the page.
   * TODO: Implement a way to render components.
   */
  mount() {
    console.warning('TBD');
  }

  /**
   * Return a new Element
   */
  element(elementOptions) {
    return Element.create({ ...elementOptions });
  }
}

export default new Elements();