const { setProcessors } = require('../src/utils/blockchain');

exports.seed = function(knex, Promise) {
  return Promise.resolve().then(async () => {
    // Deletes ALL existing entries but ID 1
    await knex('processors')
      .whereNot('id', 1)
      .del();

    await knex('processor_address')
      .whereNot('processor_id', 1)
      .del();

    // Inserts seed entries
    let address1 = '0xedbbe1fa6bc80f55c9ac7e351b777874142baaf8';
    let address2 = '0xF4b9ed39dD183504252Ee5995C58DAc8197fa12D';
    let address3 = '0xe1A1DF8C6A2DEdd7fc85e2be8B3278cD3E599A02';
    await knex('processors').insert([
      {
        id: 2, // expecting people to have created initial processor first
        name: 'Nielsen',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/82/Nielsen_logo.svg',
        description: `Nielsen, a leading global information & measurement company, provides market research, insights & data about what people watch, listen to & buy.`,
        scopes: JSON.stringify(['email', 'first name', 'purchase history'])
      },
      {
        id: 3,
        name: 'Experian',
        logoUrl: 'https://image.experiandirect.com/global-icons/logo-rb.svg?x=20170228',
        description: `Experian provides all your credit and identity theft protection needs.`,
        scopes: JSON.stringify(['email', 'first name'])
      },
      {
        id: 4,
        name: 'LiveRamp',
        logoUrl:
          'https://liveramp.com/wp-content/themes/liveramp/_img/liveramp-logo-full-color.png',
        description: `LiveRamp is an identity resolution provider offering data onboarding. We tie all of your marketing data back to real people across 1st, 2nd, or 3rd party digital and offline data silos.`,
        scopes: JSON.stringify(['email', 'first name'])
      }
    ]);
    await knex('processor_address').insert([
      { processor_id: 2, address: address1 },
      { processor_id: 3, address: address2 },
      { processor_id: 4, address: address3 }
    ]);

    let allProcessors = await this.db('processor_address').select('address');
    await setProcessors(allProcessors.map(p => p.address));
  });
};
