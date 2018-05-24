const Promise = require('bluebird');
const blockchain = require('../src/utils/blockchain');
const { SubjectDataStatus } = require('../src/utils/blockchain/models');
const { hash } = require('../src/utils/encryption');
const { subjectJWT } = require('../src/utils/jwt');

var getId = function() {
  // Math.random should be unique because of its seeding algorithm.
  // Convert it to base 36 (numbers + letters), and grab the first 9 characters
  // after the decimal.
  return (
    '_' +
    Math.random()
      .toString(36)
      .substr(2, 9)
  );
};

let i = 0;

let generateSubjectId = async function() {
  const clearId = getId();
  const subjectId = hash(clearId);
  console.log('Using subject ID:', subjectId);

  const token = await subjectJWT.sign({ subjectId: clearId });
  console.log('Token:', token);
  return subjectId;
};

function runTests() {
  setTimeout(async () => {
    console.log('Run ', i);

    const subjectId = await generateSubjectId();

    let result = await blockchain.recordConsentGivenTo(subjectId, [
      '0xedbbe1fa6bc80f55c9ac7e351b777874142baaf8'
    ]);
    console.log('Consent:', result);
    result = await blockchain.recordErasureByController(subjectId);
    console.log('Erasure by controller:', result);
    result = await blockchain.setSubjectDataState(
      subjectId,
      '0xedbbe1fa6bc80f55c9ac7e351b777874142baaf8',
      SubjectDataStatus.erased
    );
    console.log('Processor set erased state:', result);
    result = await blockchain.recordErasureByProcessor(
      subjectId,
      '0xedbbe1fa6bc80f55c9ac7e351b777874142baaf8'
    );
    console.log('Erasure by processor:', result);
    result = await blockchain.getIsErased(subjectId);
    console.log('Controller is erased:', result);
    result = await blockchain.getSubjectDataState(subjectId);
    console.log('Controller state:', result);
    result = await blockchain.getSubjectDataState(
      subjectId,
      '0xedbbe1fa6bc80f55c9ac7e351b777874142baaf8'
    );
    console.log('Processor state:', result);

    console.log('\n\n\n');
    i++;
    // again:
    runTests();
  }, 4000);
}

Promise.resolve()
  .then(() => runTests())
  .catch(console.error);
