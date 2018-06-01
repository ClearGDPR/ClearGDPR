const { celebrate, Joi } = require('celebrate');

const listSubjectsValidator = celebrate({
  //   query: Joi.object().keys({
  query: Joi.object().keys({
    page: Joi.number()
      .integer()
      .positive()
  })
});

module.exports = {
  listSubjectsValidator
};
