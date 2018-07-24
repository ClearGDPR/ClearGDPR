import Element from './Element';
import { CG } from '../js-sdk';
import config from '../config';

class Elements {
  /**
   * Set up the CG SDK.
   * Inject CG to `window` if is not declared to be accessed by components.
   */
  constructor({ apiKey, apiUrl }) {
    // TODO: Should be managed by an inject provider
    // TODO: If pure HTML implementation is used configuratio should be extracted from `data-` attributes.
    //   <div class="cg-consent" data-sitekey="your_site_key"></div>
    // TODO: `apiKey` is a way to whitelist client usage. A warning should be triggered if not defined.
    if (!window.cg) {
      const cg = new CG({ apiKey, apiUrl });
      window.cg = cg;
    }
  }

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
    if (!window.cg) {
      throw new Error('CG SDK is not defined');
    }

    return Element.create({ ...elementOptions });
  }
}

export default new Elements({
  apiKey: config.CG_API_KEY,
  apiUrl: `${config.CG_API_BASE}/api`
});
