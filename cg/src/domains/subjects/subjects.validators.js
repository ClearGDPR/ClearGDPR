const { celebrate, Joi } = require('celebrate');

const giveConsentValidator = celebrate({
  body: Joi.object().keys({
    personalData: Joi.object().required(),
    processors: Joi.array()
      .items(Joi.number().positive())
      .required()
  })
});

const updateConsentValidator = celebrate({
  body: Joi.object().keys({
    processors: Joi.array()
      .items(Joi.number().positive())
      .required()
  })
});

const rectificationValidator = celebrate({
  body: Joi.object().keys({
    rectificationPayload: Joi.object(),
    requestReason: Joi.string()
      .max(255)
      .required()
  })
});

const restrictionValidator = celebrate({
  body: Joi.object().keys({
    directMarketing: Joi.boolean().required(),
    emailCommunication: Joi.boolean().required(),
    research: Joi.boolean().required()
  })
});

const objectionValidator = celebrate({
  body: Joi.object().keys({
    objection: Joi.boolean().required()
  })
});

module.exports = {
  giveConsentValidator,
  updateConsentValidator,
  rectificationValidator,
  restrictionValidator,
  objectionValidator
};
