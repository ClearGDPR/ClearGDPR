const { celebrate, Joi } = require('celebrate');

const rectificationRequestValidator = celebrate({
  body: Joi.object().keys({
    rectificationPayload: Joi.object(),
    requestReason: Joi.string()
      .max(255)
      .required()
  })
});

module.exports = {
  rectificationRequestValidator
};
