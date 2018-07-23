const express = require('express');
const { verifyJWT } = require('./management.helpers');
const asyncHandler = require('express-async-handler');
const winston = require('winston');
const router = express.Router();

const ContractController = require('./contract/contract.controller');
const contractController = new ContractController();

const UsersController = require('./users/users.controller'); // For managers
const usersController = new UsersController();

const SubjectsController = require('./subjects/subjects.controller'); // For data subjects
const subjectsController = new SubjectsController();

const StatsController = require('./stats/stats.controller.js');
const statsController = new StatsController();

const ProcessorsController = require('./processors/processors.controller');
const processorsController = new ProcessorsController();

const { contractDeployValidator } = require('./contract/contract.validators');

const {
  addProcessorValidator,
  updateProcessorValidator,
  deleteProcessorValidator
} = require('./processors/processors.validators');

const {
  listSubjectsValidator,
  listRectificationRequestsValidator,
  getRectificiationValidator,
  updateRectificationStatusValidator,
  getSubjectRestrictionsValidator
} = require('./subjects/subjects.validators');

const {
  usersLoginValidator,
  usersRegistrationValidator,
  usersRemovalValidator,
  usersUpdatePasswordValidator
} = require('./users/users.validators');

module.exports = app => {
  app.use('/management', router);

  // keep this before the jwt middleware for now
  router.ws('/events/feed', async (ws, req) => {
    try {
      await contractController.subscribeToEventFeed(ws, req);
    } catch (e) {
      ws.send('Error subscribing to blockchain');
      winston.error(e);
    }
  });

  router.post(
    '/users/login',
    usersLoginValidator,
    asyncHandler(async (req, res) => usersController.login(req, res))
  );

  router.use(verifyJWT);

  router.post(
    '/contract/deploy',
    contractDeployValidator,
    asyncHandler(async (req, res) => contractController.deployContract(req, res))
  );

  router.get(
    '/contract/details',
    asyncHandler(async (req, res) => contractController.getContractDetails(req, res))
  );

  router.get(
    '/subjects/list',
    listSubjectsValidator,
    asyncHandler(async (req, res) => subjectsController.listSubjects(req, res))
  );

  router.get(
    '/subjects/rectification-requests/list',
    listRectificationRequestsValidator,
    asyncHandler(async (req, res) => subjectsController.listRectificationRequests(req, res))
  );

  router.get(
    '/subjects/rectification-requests/archive',
    listRectificationRequestsValidator,
    asyncHandler(async (req, res) =>
      subjectsController.listProcessedRectificationRequests(req, res)
    )
  );

  router.get(
    '/subjects/rectification-requests/:rectificationRequestId',
    getRectificiationValidator,
    asyncHandler(async (req, res) => subjectsController.getRectificationRequest(req, res))
  );

  router.post(
    '/subjects/rectification-requests/:rectificationRequestId/update-status',
    updateRectificationStatusValidator,
    asyncHandler(async (req, res) => subjectsController.updateRectificationRequestStatus(req, res))
  );

  router.get(
    '/subjects/:subjectId/get-restrictions',
    getSubjectRestrictionsValidator,
    asyncHandler(async (req, res) => subjectsController.getSubjectRestrictions(req, res))
  );

  router.get(
    '/processors/list',
    asyncHandler(async (req, res) => processorsController.listProcessors(req, res))
  );

  router.post(
    '/processors/add',
    addProcessorValidator,
    asyncHandler(async (req, res) => processorsController.addProcessor(req, res))
  );

  router.post(
    '/processors/update',
    updateProcessorValidator,
    asyncHandler(async (req, res) => processorsController.updateProcessor(req, res))
  );

  router.post(
    '/processors/remove',
    deleteProcessorValidator,
    asyncHandler(async (req, res) => processorsController.removeProcessors(req, res))
  );

  router.post(
    '/users/register',
    usersRegistrationValidator,
    asyncHandler(async (req, res) => usersController.register(req, res))
  );

  router.post(
    '/users/:userId/remove',
    usersRemovalValidator,
    asyncHandler(async (req, res) => usersController.remove(req, res))
  );

  router.post(
    '/users/:userId/update-password',
    usersUpdatePasswordValidator,
    asyncHandler(async (req, res) => usersController.updatePassword(req, res))
  );

  router.get('/users/list', asyncHandler(async (req, res) => usersController.listUsers(req, res)));

  router.get('/stats', asyncHandler(async (req, res) => statsController.stats(req, res)));
};
