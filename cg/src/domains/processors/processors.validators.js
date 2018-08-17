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
    //address: Joi.string().regex(/^0x[\da-fA-F]{40}$/)
  })
});

module.exports = {
  joinProcessorsValidator
};
