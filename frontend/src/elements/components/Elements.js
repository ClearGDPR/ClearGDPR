// Inject CG on window
// <div class="cg-consent" data-sitekey="your_site_key"></div>
// TODO: This should be injected by injectProvider, and previously
// injected into `window` when dev imports `js-sdk` through CDN.
// TODO: Client is whitelisted by CORS
import { CG } from '../../js-sdk';
import config from '../../config';

const { CG_API_BASE, CG_API_KEY } = config;

export default function Elements() {
  // CG.render|mount
  // Parse html to get attribute data-access-token from main element
  // Inject CG if its not declared in window
  // TODO: Should be managed by inject provider and provider classes
  if (!window.cg) {
    const cg = new CG({
      apiKey: CG_API_KEY,
      apiUrl: CG_API_BASE + '/api' // temp fix
    });
    window.cg = cg;
  }
}
