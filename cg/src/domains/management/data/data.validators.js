const { celebrate, Joi } = require('celebrate');

const updateAttributesConfigValidator = celebrate({
  body: Joi.object().pattern(
    /.*/,
    Joi.object()
      .keys({
        type: Joi.any().valid(['email', 'number', 'select', 'string', 'text']),
        label: Joi.string(),
        required: Joi.boolean(),
        placeholder: Joi.string(),
        defaultValue: Joi.any(),
        options: Joi.array()
      })
      .requiredKeys(['type', 'label'])
  )
});

module.exports = {
  updateAttributesConfigValidator
};
