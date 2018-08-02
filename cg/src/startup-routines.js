const { startAll } = require('./domains/processors/processors.listeners');
const { pollForContractUpdate } = require('./domains/processors/processors.helpers');
const { inControllerMode } = require('./utils/helpers');

const { ensureInitialManagementUser } = require('./domains/management/users/users.helpers');

async function startupRoutines() {
  if (!inControllerMode()) await pollForContractUpdate(); // Processor polls for smart contract updates
  await startAll(); // Start all processor listeners for blockchain events
  await ensureInitialManagementUser();
}

module.exports = startupRoutines;
