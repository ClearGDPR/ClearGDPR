const { celebrate, Joi } = require('celebrate');
const { PENDING, DISAPPROVED, APPROVED } = require('./../../../utils/constants');

const listSubjectsValidator = celebrate({
  query: Joi.object().keys({
    page: Joi.number()
      .integer()
      .positive()
  })
});

const listRectificationRequestsValidator = celebrate({
  query: Joi.object().keys({
    page: Joi.number()
      .integer()
      .positive()
  })
});

const updateRectificationStatusValidator = celebrate({
  body: {
    status: Joi.string()
      .valid(PENDING, DISAPPROVED, APPROVED)
      .required()
  },
  param: {
    rectificationId: Joi.integer().required()
  }
});

const getRectificiationValidator = celebrate({
  param: {
    rectificationId: Joi.integer().required()
  }
});

module.exports = {
  listSubjectsValidator,
  listRectificationRequestsValidator,
  updateRectificationStatusValidator,
  getRectificiationValidator
};
