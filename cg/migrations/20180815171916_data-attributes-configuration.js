const KEY = 'SUBJECT_DATA_ATTRIBUTES_CONFIG';

exports.up = async function(knex, Promise) {
  await knex('config').insert({
    key: KEY,
    value: JSON.stringify({
      email: {
        type: 'email',
        label: 'Your email address',
        required: true
      },
      firstname: {
        type: 'string',
        label: 'First name',
        required: true
      },
      lastname: {
        type: 'string',
        label: 'Last name',
        required: true
      },
      website: {
        type: 'string',
        label: 'Website',
        required: true
      }
    })
  });
};

exports.down = async function(knex, Promise) {
  await knex('config')
    .where('key', KEY)
    .delete();
};
