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

module.exports = {
  removeDataShareValidator,
  createDataShareValidator
};
