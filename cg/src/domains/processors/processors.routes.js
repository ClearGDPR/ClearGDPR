const express = require('express');
const { verifyJWT, ensureProcessorAccessToSubject } = require('./processors.helpers');
const { controllerOnly } = require('./../../utils/middleware');
const asyncHandler = require('express-async-handler');
const router = express.Router();

const ProcessorsController = require('./processors.controller');
const processorsController = new ProcessorsController();

const { joinProcessorsValidator } = require('./processors.validators');

module.exports = app => {
  app.use('/processors', router);

  router.post(
    '/join',
    controllerOnly,
    joinProcessorsValidator,
    asyncHandler(async (req, res) => processorsController.join(req, res))
  );

  router.use(verifyJWT);

  router.get(
    '/contract/details',
    asyncHandler(async (req, res) => processorsController.getContractDetails(req, res))
  );

  router.get(
    '/subject/:subjectId/data',
    controllerOnly,
    asyncHandler(ensureProcessorAccessToSubject),
    asyncHandler(async (req, res) => processorsController.getSubjectData(req, res))
  );

  router.get(
    '/subject/:subjectId/restrictions',
    controllerOnly,
    asyncHandler(ensureProcessorAccessToSubject),
    asyncHandler(async (req, res) => processorsController.getSubjectRestrictions(req, res))
  );

  router.get(
    '/subject/:subjectId/objection',
    controllerOnly,
    asyncHandler(ensureProcessorAccessToSubject),
    asyncHandler(async (req, res) => processorsController.getSubjectObjection(req, res))
  );

  router.get(
    '/subjects',
    asyncHandler(async (req, res) => processorsController.getSubjects(req, res))
  );
};
