const express = require('express');
const { verifyJWT, ensureProcessorAccessToSubject } = require('./processors.helpers');
const { controllerOnly } = require('./../../utils/middleware');
const asyncHandler = require('express-async-handler');
const router = express.Router();

const ProcessorsController = require('./processors.controller');
const processorsController = new ProcessorsController();

module.exports = app => {
  app.use('/processors', router);

  router.use(verifyJWT);

  router.get(
    '/subject/:subjectId/data',
    controllerOnly,
    asyncHandler(ensureProcessorAccessToSubject),
    asyncHandler(async (req, res) => processorsController.getSubjectData(req, res))
  );

  router.get(
    '/contract/details',
    asyncHandler(async (req, res) => processorsController.getContractDetails(req, res))
  );
};
