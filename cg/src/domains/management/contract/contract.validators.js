const { celebrate, Joi } = require('celebrate');

const contractDeployValidator = celebrate({
  body: Joi.object().keys({
    abiJson: Joi.string().required(),
    compiledData: Joi.string().required()
  })
});

module.exports = {
  contractDeployValidator
};
