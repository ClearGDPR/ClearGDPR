const { celebrate, Joi } = require('celebrate');
const {
  RECTIFICATION_STATUSES: { PENDING, DISAPPROVED, APPROVED }
} = require('./../../../utils/constants');

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
  params: {
    rectificationRequestId: Joi.number()
      .integer()
      .positive()
      .required()
  }
});

const getRectificiationValidator = celebrate({
  params: {
    rectificationRequestId: Joi.number()
      .integer()
      .positive()
      .required()
  }
});

const getSubjectRestrictionsValidator = celebrate({
  params: {
    subjectId: Joi.string()
      .alphanum()
      .length(66) // length of a sha3 hash with the prepended '0x'
      .required()
  }
});

module.exports = {
  listSubjectsValidator,
  listRectificationRequestsValidator,
  updateRectificationStatusValidator,
  getRectificiationValidator,
  getSubjectRestrictionsValidator
};
