const { celebrate, Joi } = require('celebrate');

const contractDeployValidator = celebrate({
  body: Joi.object().keys({
    contractAbiJson: Joi.string().required(),
    contractByteCode: Joi.string().required()
  })
});

module.exports = {
  contractDeployValidator
};
