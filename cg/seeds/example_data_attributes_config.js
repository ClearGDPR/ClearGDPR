exports.seed = async function(knex, Promise) {
  await knex('config').insert({
    key: 'SUBJECT_DATA_ATTRIBUTES_CONFIG',
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
