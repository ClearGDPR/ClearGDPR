import { ResourceBase } from '../common/base';

// TODO: Research a way to autogenerate this (https://github.com/dropbox/stone)
export const SUBJECT = 'subject';
export default class Subject extends ResourceBase {
  giveConsent(payload) {
    const method = 'POST';
    return this.request(`${SUBJECT}/give-consent`, { method, payload });
  }

  accessData() {
    return this.request(`${SUBJECT}/access-data`);
  }

  eraseData() {
    const method = 'POST';
    return this.request(`${SUBJECT}/erase-data`, { method });
  }

  getDataStatus() {
    return this.request(`${SUBJECT}/data-status`);
  }

  getProcessors() {
    return this.request(`${SUBJECT}/processors`);
  }
}
