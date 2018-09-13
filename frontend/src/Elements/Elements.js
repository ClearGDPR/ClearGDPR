import Element from './Element';

class Elements {
  element(elementOptions) {
    return Element.create({ ...elementOptions });
  }
}

export default new Elements();
