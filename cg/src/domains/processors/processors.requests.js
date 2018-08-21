const { NotFound } = require('../../utils/errors');
const fetch = require('node-fetch');
const CONTROLLER_URL = process.env.CONTROLLER_URL;
const PROCESSOR_JWT = process.env.PROCESSOR_JWT;

const winston = require('winston');

async function getDataForSubject(subjectId) {
  return await fetch(`${CONTROLLER_URL}/api/processors/subject/${subjectId}/data`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${PROCESSOR_JWT}`
    }
  });
}

async function getRestrictionsForSubject(subjectId) {
  return await fetch(`${CONTROLLER_URL}/api/processors/subject/${subjectId}/restrictions`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${PROCESSOR_JWT}`
    }
  });
}

async function getContractDetails() {
  try {
    const res = await fetch(`${CONTROLLER_URL}/api/processors/contract/details`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${PROCESSOR_JWT}`
      }
    });

    if (res.ok) {
      return await res.json();
    } else if (res.status === NotFound.StatusCode) {
      return null;
    } else {
      throw new Error(`Unknown error occurred:
        Status: ${res.status}
        Reason: ${res.statusText}
      `);
    }
  } catch (e) {
    winston.error(`Error getting contract details from ${CONTROLLER_URL}`);
    winston.error(e);
    return null;
  }
}

module.exports = {
  getDataForSubject,
  getRestrictionsForSubject,
  getContractDetails
};
