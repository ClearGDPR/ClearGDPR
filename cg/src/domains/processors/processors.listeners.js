const {
  listenerForErasureEvent,
  listenerForConsentEvent,
  listenerForRectificationEvent,
  listenerForRestrictionEvent,
  listenerForObjectionEvent
} = require('./../../utils/blockchain');
const { getDataForSubject } = require('./processors.requests');
const { blockUntilContractReady } = require('./processors.helpers');
const { inControllerMode } = require('../../utils/helpers');
const SubjectsService = require('./subjects.service');
const winston = require('winston');

const subjectsService = new SubjectsService();

const startConsentEventListener = () => {
  return listenerForConsentEvent(async subjectId => {
    winston.info(`Consent event received from subject ${subjectId}`);
    const response = await getDataForSubject(subjectId).catch(err => {
      return Promise.reject(err);
    });
    await subjectsService.initializeUser(subjectId, await response.json());
  });
};

const startRectificationEventListener = () => {
  return listenerForRectificationEvent(async subjectId => {
    winston.info(`Rectification event received for subject ${subjectId}`);
    const response = await getDataForSubject(subjectId).catch(err => {
      return Promise.reject(err);
    });
    await subjectsService.initializeUser(subjectId, await response.json());
  });
};

const startRestrictionEventListener = () => {
  return listenerForRestrictionEvent(
    async (subjectId, directMarketing, emailCommunication, research) => {
      winston.info(`Restriction event received for subject ${subjectId}`);
      await subjectsService.restrict(subjectId, directMarketing, emailCommunication, research);
    }
  );
};

const startObjectionEventListener = () => {
  return listenerForObjectionEvent(async (subjectId, objection) => {
    winston.info(`Objection event received for subject ${subjectId}`);
    await subjectsService.object(subjectId, objection);
  });
};

const startErasureEventListener = () => {
  return listenerForErasureEvent(async subjectId => {
    winston.info(`Erasure event received for subject ${subjectId}`);
    await subjectsService.eraseDataAndRevokeConsent(subjectId);
  });
};

const startAll = async () => {
  if (inControllerMode()) {
    return;
  }
  await blockUntilContractReady();
  winston.info(`Starting listeners in PROCESSOR mode`);
  await startConsentEventListener();
  await startRectificationEventListener();
  await startRestrictionEventListener();
  await startObjectionEventListener();
  await startErasureEventListener();
};

module.exports = {
  startAll
};
