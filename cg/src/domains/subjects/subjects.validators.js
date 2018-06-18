const { celebrate, Joi } = require('celebrate');

const rectificationRequestValidator = celebrate({
  body: Joi.object().keys({
    rectificationPayload: Joi.string().required(),
    reason: Joi.string()
      .max('255')
      .required()
  })
});

module.exports = {
  rectificationRequestValidator
};
