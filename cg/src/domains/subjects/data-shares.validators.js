const { celebrate, Joi } = require('celebrate');

const createDataShareValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string()
      .required()
      .max(255)
  })
});

const removeDataShareValidator = celebrate({
  params: Joi.object().keys({
    dataShareId: Joi.number().required()
  })
});

const shareDataShareValidator = celebrate({
  query: Joi.object().keys({
    token: Joi.string().required()
  })
});

module.exports = {
  removeDataShareValidator,
  createDataShareValidator,
  shareDataShareValidator
};
