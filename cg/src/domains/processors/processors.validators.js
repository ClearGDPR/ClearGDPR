const { celebrate, Joi } = require('celebrate');

const joinProcessorsValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string()
      .required()
      .max(255),
    logoUrl: Joi.string().max(255),
    description: Joi.string(),
    scopes: Joi.object().keys({
      directMarketing: Joi.boolean(),
      emailCommunication: Joi.boolean(),
      research: Joi.boolean()
    })
    // enode
    // accountAddress
  })
});

module.exports = {
  joinProcessorsValidator
};
