const {
  listenForErasureRequest,
  listenForConsent,
  listenerForRectificationEvent
} = require('./../../utils/blockchain');
const { getDataForSubject } = require('./processors.requests');
const { blockUntilContractReady } = require('./processors.helpers');
const { inControllerMode } = require('../../utils/helpers');
const SubjectSService = require('./../subjects/subjects.service');
const winston = require('winston');

const subjectsService = new SubjectSService();

const startErasureRequestListener = () => {
  return listenForErasureRequest(async subjectId => {
    winston.info(`Erasure event received for subject ${subjectId}`);
    await subjectsService.eraseDataAndRevokeConsent(subjectId);
  });
};

const startRectificationEventListener = () => {
  return listenerForRectificationEvent(async subjectId => {
    winston.info(`rectification event received for subject ${subjectId}`);
    const response = await getDataForSubject(subjectId).catch(err => {
      return Promise.reject(err);
    });
    console.log('1111');
    await subjectsService.initializeUser(subjectId, await response.json());
    console.log('FINAL');
  });
};

const startConsentListener = () => {
  return listenForConsent(async subjectId => {
    // if consent given, get data and store it in our d
    winston.info(`Consent received from subject ${subjectId}`);
    const response = await getDataForSubject(subjectId).catch(err => {
      return Promise.reject(err);
    });
    await subjectsService.initializeUser(subjectId, await response.json());
  });
};

const startAll = async () => {
  if (inControllerMode()) {
    return;
  }

  await blockUntilContractReady();

  winston.info(`Starting listeners in processor mode`);
  await startConsentListener();
  await startErasureRequestListener();
  await startRectificationEventListener();
};

module.exports = {
  startAll
};
