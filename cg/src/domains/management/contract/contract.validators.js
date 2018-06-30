const { celebrate, Joi } = require('celebrate');

const contractDeployValidator = celebrate({
  body: Joi.object().keys({
    contractABIJson: Joi.string().required(),
    contractByteCode: Joi.string().required()
  })
});

module.exports = {
  contractDeployValidator
};
