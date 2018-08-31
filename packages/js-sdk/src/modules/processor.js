import { ResourceBase } from '../common/base';

// TODO: Research a way to autogenerate this (https://github.com/dropbox/stone)
export const PROCESSORS = 'processors';
export default class Processor extends ResourceBase {
  getSubjects(payload) {
    return this.request(`${PROCESSORS}/subjects`, { payload });
  }
  accessSubjectData(payload) {
    return this.request(`${PROCESSORS}/subject/:subjectId/data`, { payload });
  }
  getSubjectRestrictions(payload) {
    return this.request(`${PROCESSORS}/subject/:subjectId/restrictions`, { payload });
  }
  getSubjectObjection(payload) {
    return this.request(`${PROCESSORS}/subject/:subjectId/objection`, { payload });
  }
}
