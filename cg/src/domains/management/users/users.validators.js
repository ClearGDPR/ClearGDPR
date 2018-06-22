const { celebrate, Joi } = require('celebrate');

const usersRegistrationValidator = celebrate({
  body: Joi.object().keys({
    username: Joi.string()
      .required()
      .max(255),
    password: Joi.string()
      .required()
      .min(8)
      .max(255)
  })
});

const usersRemovalValidator = celebrate({
  params: Joi.object().keys({
    userId: Joi.number()
      .integer()
      .positive()
      .required()
  })
});

const usersLoginValidator = celebrate({
  body: Joi.object().keys({
    username: Joi.string()
      .required()
      .max(255),
    password: Joi.string()
      .required()
      .min(8)
      .max(255)
  })
});

const usersUpdatePasswordValidator = celebrate({
  params: Joi.object().keys({
    userId: Joi.string()
      .required()
      .max(255)
  }),
  body: Joi.object().keys({
    password: Joi.string()
      .required()
      .min(8)
      .max(255)
  })
});

module.exports = {
  usersRegistrationValidator,
  usersRemovalValidator,
  usersLoginValidator,
  usersUpdatePasswordValidator
};
