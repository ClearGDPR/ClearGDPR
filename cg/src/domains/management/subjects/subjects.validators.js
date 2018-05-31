const { celebrate, Joi } = require('celebrate');

const listSubjectsValidator = celebrate({
  //   query: Joi.object().keys({
  query: Joi.object().keys({
    page: Joi.number()
      .integer()
      .greater(-1)
  })
});

module.exports = {
  listSubjectsValidator
};
