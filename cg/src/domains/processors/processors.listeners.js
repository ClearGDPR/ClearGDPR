const {
  listenerForErasureEvent,
  listenerForConsentEvent,
  listenerForRectificationEvent
} = require('./../../utils/blockchain');
const { getDataForSubject } = require('./processors.requests');
const { blockUntilContractReady } = require('./processors.helpers');
const { inControllerMode } = require('../../utils/helpers');
const SubjectSService = require('./../subjects/subjects.service');
const winston = require('winston');

const subjectsService = new SubjectSService();

const startConsentEventListener = () => {
  return listenerForConsentEvent(async subjectId => {
    // if consent given, get data and store it in our db
    winston.info(`Consent received from subject ${subjectId}`);
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

  winston.info(`Starting listeners in processor mode`);
  await startConsentEventListener();
  await startErasureEventListener();
  await startRectificationEventListener();
};

module.exports = {
  startAll
};
