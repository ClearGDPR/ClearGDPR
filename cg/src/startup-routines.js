const { startAll } = require('./domains/processors/processors.listeners');
const { pollForContractUpdate } = require('./domains/processors/processors.helpers');
const { inControllerMode } = require('./utils/helpers');

const { ensureInitialManagementUser } = require('./domains/management/users/users.helpers');

async function startupRoutines() {
  if (!inControllerMode()) await pollForContractUpdate();
  await startAll();
  await ensureInitialManagementUser();
}

module.exports = startupRoutines;
