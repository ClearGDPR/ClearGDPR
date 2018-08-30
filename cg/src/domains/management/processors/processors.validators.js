const { celebrate, Joi } = require('celebrate');

const addProcessorValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string()
      .required()
      .max(255),
    logoUrl: Joi.string().max(255),
    description: Joi.string(),
    scopes: Joi.array().items(Joi.string()),
    enode: Joi.string()
      .required()
      .max(255),
    accountAddress: Joi.string().regex(/^0x[\da-fA-F]{40}$/) // Blockchain account address
  })
});

const updateProcessorValidator = celebrate({
  body: Joi.object().keys({
    id: Joi.number().required(),
    name: Joi.string().max(255),
    logoUrl: Joi.string().max(255),
    description: Joi.string(),
    scopes: Joi.array().items(Joi.string())
  })
});

const deleteProcessorValidator = celebrate({
  body: Joi.object().keys({
    processorIds: Joi.array()
      .items(Joi.number())
      .required()
  })
});

const testAddProcessorValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string()
      .required()
      .max(255),
    logoUrl: Joi.string().max(255),
    description: Joi.string(),
    scopes: Joi.array().items(Joi.string()),
    accountAddress: Joi.string().regex(/^0x[\da-fA-F]{40}$/) // Blockchain account address
  })
});

const testDeleteProcessorsValidator = celebrate({
  body: Joi.object().keys({
    processorIds: Joi.array()
      .items(Joi.number())
      .required()
  })
});

module.exports = {
  addProcessorValidator,
  updateProcessorValidator,
  deleteProcessorValidator,
  testAddProcessorValidator,
  testDeleteProcessorsValidator
};
