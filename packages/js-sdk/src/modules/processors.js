import { ResourceBase } from '../common/base';

// TODO: Research a way to autogenerate this (https://github.com/dropbox/stone)
export const PROCESSORS = 'processors';
export default class Processors extends ResourceBase {
  ensureProcessorAccessToSubject(payload) {
    return this.request(`${PROCESSORS}/subject/:subjectId/data`, { payload });
  }
}
