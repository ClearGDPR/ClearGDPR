const {
  getRectificationCount,
  getIsErased,
  getSubjectDataState,
  getProcessors,
  setSubjectDataState,
  setProcessors,
  isProcessor,
  areAllValidProcessors,
  recordProcessorsUpdate,
  recordConsentGivenTo,
  recordAccessByController,
  recordRectificationByController,
  recordErasureByController,
  recordErasureByProcessor,
  getPastEvents
} = require('../src/utils/blockchain');

getRectificationCount('0x0000000000000000000000000000000000000000000000000000000000000001')
  .then(console.log)
  .catch(console.error)
  .then(() => process.exit(0));

// recordRectificationByController('0x0000000000000000000000000000000000000000000000000000000000000001')
//   .then(console.log)
//   .catch(console.error)
//   .then(() => process.exit(0));

// getPastEvents('allEvents')
//   .then(console.log)
//   .catch(console.error)
//   .then(() => process.exit(0));
