import { ResourceBase } from '../common/base';

// TODO: Research a way to autogenerate this (https://github.com/dropbox/stone)
export const SUBJECT = 'subject';
export default class Subject extends ResourceBase {
  giveConsent(payload) {
    const method = 'POST';
    return this.request(`${SUBJECT}/consent`, { method, payload });
  }

  updateConsent(payload) {
    const method = 'PUT';
    return this.request(`${SUBJECT}/consent`, { method, payload });
  }

  getObjectionStatus() {
    return this.request(`${SUBJECT}/objection`);
  }

  updateObjection(restrictProcessing) {
    const method = 'POST';
    return this.request(`${SUBJECT}/object`, {
      method,
      payload: { objection: restrictProcessing }
    });
  }

  accessData() {
    return this.request(`${SUBJECT}/data`);
  }

  eraseData() {
    const method = 'DELETE';
    return this.request(`${SUBJECT}/data`, { method });
  }

  getDataStatus() {
    return this.request(`${SUBJECT}/data/status`);
  }

  getProcessors() {
    return this.request(`${SUBJECT}/processors`);
  }

  getSharedData(token) {
    return this.request(`${SUBJECT}/data-shares/share?token=${token}`);
  }

  getDataShares() {
    return this.request(`${SUBJECT}/data-shares`);
  }

  addDataShare(payload) {
    const method = 'POST';
    return this.request(`${SUBJECT}/data-shares`, { method, payload });
  }

  removeDataShare(dataShareId) {
    const method = 'DELETE';
    return this.request(`${SUBJECT}/data-shares/${dataShareId}`, { method });
  }

  initiateRectification(requestReason, rectificationPayload) {
    const method = 'POST';
    return this.request(`${SUBJECT}/rectification`, {
      method,
      payload: { requestReason, rectificationPayload }
    });
  }

  getRestrictions() {
    return this.request(`${SUBJECT}/restrictions`);
  }

  updateRestrictions({ directMarketing, emailCommunication, research }) {
    const method = 'POST';
    return this.request(`${SUBJECT}/restrictions`, {
      method,
      payload: {
        directMarketing,
        emailCommunication,
        research
      }
    });
  }
}
