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
      this.cg = new CG({ apiKey, apiUrl });
      this.cg.setAccessToken(localStorage.getItem('cgToken'));
      window.cg = this.cg;
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
    return Element.create({ ...elementOptions, cg: this.cg });
  }
}

export default new Elements({
  apiKey: config.CG_API_KEY,
  apiUrl: `${config.CG_API_BASE}/api`
});
