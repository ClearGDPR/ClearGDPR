const Promise = require('bluebird');
const {
  db
} = require('../src/db');
const {
  setProcessors
} = require('../src/utils/blockchain');
const arguments = process.argv.slice(2);
const [address] = arguments;

Promise.resolve().then(async () => {
  await db('processors').insert({
    id: 1,
    name: 'Example Processor',
    description: `This is an example processor`,
    scopes: JSON.stringify(['email', 'first name', 'last name'])
  });

  await db('processor_address').insert({
    processor_id: 1,
    address
  });

  await setProcessors([address]);

  console.log(`Processor with address ${address} added`);
  process.exit(0);
})
.catch(e => {
    console.error(e);
    process.exit(1);
});
