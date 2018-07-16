import { ResourceBase } from '../common/base';

// TODO: Research a way to autogenerate this (https://github.com/dropbox/stone)
export const SUBJECT = 'subject';
export default class Subject extends ResourceBase {
  giveConsent(payload) {
    const method = 'POST';
    return this.request(`${SUBJECT}/give-consent`, { method, payload });
  }

  updateConsent(payload) {
    const method = 'POST';
    return this.request(`${SUBJECT}/update-consent`, { method, payload });
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

  shareData() {
    return this.request(`${SUBJECT}/data-shares/share`);
  }

  getDataShares() {
    return this.request(`${SUBJECT}/data-shares/list`);
  }

  addDataShare(payload) {
    const method = 'POST';
    return this.request(`${SUBJECT}/data-shares/create`, { method, payload });
  }

  removeDataShare(dataShareId) {
    const method = 'POST';
    return this.request(`${SUBJECT}/data-shares/${dataShareId}/remove`, method);
  }
}
