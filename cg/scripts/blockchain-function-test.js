// Command to execute this script:
// docker-compose exec cg node scripts/blockchain-function-test.js

const {
  getRectificationCount,
  getIsErased,
  getSubjectDataState,
  getSubjectRestrictions,
  getSubjectObjection,
  getProcessors,
  setSubjectDataState,
  setSubjectRestrictions,
  setSubjectObjection,
  setProcessors,
  isProcessor,
  areAllValidProcessors,
  recordProcessorsUpdate,
  recordConsentGivenTo,
  recordAccessByController,
  recordRectificationByController,
  recordRestrictionByController,
  recordObjectionByController,
  recordErasureByController,
  recordErasureByProcessor,
  getPastEvents
} = require('../src/utils/blockchain');

// To test the functions, uncomment one and execute it, one at a time.

// getRectificationCount("0x1111111111111111111111111111111111111111111111111111111111111111")
//   .then(console.log)
//   .catch(console.error)
//   .then(() => process.exit(0));

// getIsErased("0x1111111111111111111111111111111111111111111111111111111111111111")
//   .then(console.log)
//   .catch(console.error)
//   .then(() => process.exit(0));

// getSubjectDataState("0x1111111111111111111111111111111111111111111111111111111111111111", "0x0000000000000000000000000000000000000001")
//   .then(console.log)
//   .catch(console.error)
//   .then(() => process.exit(0));

// getSubjectRestrictions("0x1111111111111111111111111111111111111111111111111111111111111111")
//   .then(console.log)
//   .catch(console.error)
//   .then(() => process.exit(0));

// getSubjectObjection("0x1111111111111111111111111111111111111111111111111111111111111111")
//   .then(console.log)
//   .catch(console.error)
//   .then(() => process.exit(0));

// setSubjectDataState("0x1111111111111111111111111111111111111111111111111111111111111111", "0x0000000000000000000000000000000000000001", 1)
//   .then(console.log)
//   .catch(console.error)
//   .then(() => process.exit(0));

// setSubjectRestrictions("0x1111111111111111111111111111111111111111111111111111111111111111", true, false, true)
//   .then(console.log)
//   .catch(console.error)
//   .then(() => process.exit(0));

// setSubjectObjection("0x1111111111111111111111111111111111111111111111111111111111111111", true)
//   .then(console.log)
//   .catch(console.error)
//   .then(() => process.exit(0));

// getProcessors()
//   .then(console.log)
//   .catch(console.error)
//   .then(() => process.exit(0));

// setProcessors(["0x0000000000000000000000000000000000000001", "0x0000000000000000000000000000000000000002"])
//   .then(console.log)
//   .catch(console.error)
//   .then(() => process.exit(0));

// isProcessor("0x0000000000000000000000000000000000000001")
//   .then(console.log)
//   .catch(console.error)
//   .then(() => process.exit(0));

// areAllValidProcessors(["0x0000000000000000000000000000000000000001", "0x0000000000000000000000000000000000000002"])
//   .then(console.log)
//   .catch(console.error)
//   .then(() => process.exit(0));

// recordProcessorsUpdate(["0x0000000000000000000000000000000000000001", "0x0000000000000000000000000000000000000002"])
//   .then(console.log)
//   .catch(console.error)
//   .then(() => process.exit(0));

// recordConsentGivenTo("0x1111111111111111111111111111111111111111111111111111111111111111", ["0x0000000000000000000000000000000000000001", "0x0000000000000000000000000000000000000002"])
//   .then(console.log)
//   .catch(console.error)
//   .then(() => process.exit(0));

// recordAccessByController("0x1111111111111111111111111111111111111111111111111111111111111111")
//   .then(console.log)
//   .catch(console.error)
//   .then(() => process.exit(0));

// recordRectificationByController("0x1111111111111111111111111111111111111111111111111111111111111111")
//   .then(console.log)
//   .catch(console.error)
//   .then(() => process.exit(0));

// recordRestrictionByController("0x1111111111111111111111111111111111111111111111111111111111111111", false, true, false)
//   .then(console.log)
//   .catch(console.error)
//   .then(() => process.exit(0));

// recordObjectionByController("0x1111111111111111111111111111111111111111111111111111111111111111", true)
//   .then(console.log)
//   .catch(console.error)
//   .then(() => process.exit(0));

// recordErasureByController("0x1111111111111111111111111111111111111111111111111111111111111111")
//   .then(console.log)
//   .catch(console.error)
//   .then(() => process.exit(0));

// recordErasureByProcessor("0x1111111111111111111111111111111111111111111111111111111111111111", "0x0000000000000000000000000000000000000001")
//   .then(console.log)
//   .catch(console.error)
//   .then(() => process.exit(0));

// getPastEvents('allEvents')
//   .then(console.log)
//   .catch(console.error)
//   .then(() => process.exit(0));
