const express = require('express');
const { verifyJWT } = require('./subjects.helpers');
const { requireSubjectId, transformSubjectId } = require('./subjects.helpers');
const asyncHandler = require('express-async-handler');
const { controllerOnly } = require('./../../utils/middleware');

const {
  createDataShareValidator,
  removeDataShareValidator,
  shareDataShareValidator
} = require('./data-shares.validators');

const {
  giveConsentValidator,
  updateConsentValidator,
  rectificationValidator,
  restrictionValidator,
  objectionValidator
} = require('./subjects.validators');

const router = express.Router();

const { subjectNotErased } = require('./subjects.middlewares');

const SubjectsController = require('./subjects.controller');
const subjectsController = new SubjectsController();

const DataShareController = require('./data-shares.controller');
const dataShareController = new DataShareController();

const ProcessorsController = require('./processors.controller');
const processorsController = new ProcessorsController();

module.exports = app => {
  // Not using router, because this is a publicly open endpoint (no need to verify JWT)
  // also needs to be registered before other routes under /subject, so don't reorder

  app.use('/subject', router);

  // UNSECURED ENDPOINTS

  router.get(
    '/processors',
    controllerOnly,
    asyncHandler(processorsController.getProcessors.bind(processorsController))
  );

  // Shouldn't this be secure?
  router.get(
    '/data-shares/share',
    shareDataShareValidator,
    asyncHandler(async (req, res) => dataShareController.share(req, res))
  );

  // JWT SECURED ENDPOINTS

  router.use(verifyJWT, requireSubjectId, transformSubjectId);

  router.use(asyncHandler(async (req, res, next) => subjectNotErased(req, res, next)));

  router.post(
    '/consent',
    controllerOnly,
    giveConsentValidator,
    asyncHandler(async (req, res) => subjectsController.giveConsent(req, res))
  );

  router.put(
    '/consent',
    controllerOnly,
    updateConsentValidator,
    asyncHandler(async (req, res) => subjectsController.updateConsent(req, res))
  );

  router.get(
    '/data',
    asyncHandler(async (req, res) => subjectsController.requestDataAccess(req, res))
  );

  router.delete(
    '/data',
    controllerOnly,
    asyncHandler(async (req, res) => subjectsController.eraseData(req, res))
  );

  router.get(
    '/data/status',
    asyncHandler(async (req, res) => subjectsController.getPersonalDataStatus(req, res))
  );

  router.post(
    '/rectification',
    rectificationValidator,
    asyncHandler(async (req, res) => subjectsController.initiateRectification(req, res))
  );

  router.get(
    '/restrictions',
    asyncHandler(async (req, res) => subjectsController.getRestrictions(req, res))
  );

  router.post(
    '/restrictions',
    controllerOnly,
    restrictionValidator,
    asyncHandler(async (req, res) => subjectsController.restrict(req, res))
  );

  router.get(
    '/objection',
    asyncHandler(async (req, res) => subjectsController.getObjection(req, res))
  );

  router.post(
    '/objection',
    controllerOnly,
    objectionValidator,
    asyncHandler(async (req, res) => subjectsController.object(req, res))
  );

  router.get(
    '/data-shares',
    asyncHandler(async (req, res) => dataShareController.getDataShares(req, res))
  );

  router.post(
    '/data-shares',
    createDataShareValidator,
    asyncHandler(async (req, res) => dataShareController.createDataShare(req, res))
  );

  router.delete(
    '/data-shares/:dataShareId',
    removeDataShareValidator,
    asyncHandler(async (req, res) => dataShareController.removeDataShare(req, res))
  );
};
