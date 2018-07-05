// docker-compose exec cg node scripts/blockchain-function-test.js

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

// setSubjectDataState("0x1111111111111111111111111111111111111111111111111111111111111111", "0x0000000000000000000000000000000000000001", 1)
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

// recordProcessorsUpdate(["0x0000000000000000000000000000000000000001", "0x0000000000000000000000000000000000000002", "0x72ac6221762f4a939aeff08c500f9ef493a8e020"])
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

recordRectificationByController(
  '0x1111111111111111111111111111111111111111111111111111111111111111'
)
  .then(console.log)
  .catch(console.error)
  .then(() => process.exit(0));

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
