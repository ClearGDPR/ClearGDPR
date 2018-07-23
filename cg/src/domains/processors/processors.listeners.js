const {
  listenerForErasureEvent,
  listenerForConsentEvent,
  listenerForRectificationEvent,
  listenerForRestrictionEvent
} = require('./../../utils/blockchain');
const { getDataForSubject, getRestrictionsForSubject } = require('./processors.requests');
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
  return listenerForRestrictionEvent(async subjectId => {
    winston.info(`Restriction event received for subject ${subjectId}`);
    const response = await getRestrictionsForSubject(subjectId).catch(err => {
      return Promise.reject(err);
    });
    const subjectRestrictions = await response.json();
    await subjectsService.restrict(
      subjectId,
      subjectRestrictions.direct_marketing,
      subjectRestrictions.email_communication,
      subjectRestrictions.research
    );
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
  await startErasureEventListener();
};

module.exports = {
  startAll
};
