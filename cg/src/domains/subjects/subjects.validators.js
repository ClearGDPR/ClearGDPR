const { celebrate, Joi } = require('celebrate');

const giveConsentValidator = celebrate({
  body: Joi.object().keys({
    personalData: Joi.object()
      .required(),
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

const rectificationRequestValidator = celebrate({
  body: Joi.object().keys({
    rectificationPayload: Joi.object(),
    requestReason: Joi.string()
      .max(255)
      .required()
  })
});



module.exports = {
  giveConsentValidator,
  updateConsentValidator,
  rectificationRequestValidator
};
