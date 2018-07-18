const express = require('express');
const { verifyJWT, ensureProcessorAccessToSubject } = require('./processors.helpers');
const { controllerOnly } = require('./../../utils/middleware');
const asyncHandler = require('express-async-handler');
const router = express.Router();

const processorController = require('./processors.controller');
const controller = new processorController();

module.exports = app => {
  app.use('/processors', router);

  router.use(verifyJWT);

  router.get(
    '/subject/:subjectId/data',
    controllerOnly,
    asyncHandler(ensureProcessorAccessToSubject),
    asyncHandler(async (req, res) => controller.getSubjectData(req, res))
  );

  router.get(
    '/contract/details',
    asyncHandler(async (req, res) => controller.getContractDetails(req, res))
  );
};
