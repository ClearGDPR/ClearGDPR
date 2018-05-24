const { Unauthorized } = require('../../utils/errors');
const { subjectJWT } = require('./../../utils/jwt');
const jwtMiddlewareFactory = require('./../../utils/jwt-middleware-factory');
const { hash } = require('../../utils/encryption');

const requireSubjectId = async (req, res, next) => {
  if (!req.subject.subjectId) {
    return next(new Unauthorized('You are not authorized to perform this action'));
  }

  req.subject.id = req.subject.subjectId;
  delete req.subject.subjectId;

  return next();
};

const transformSubjectId = async (req, res, next) => {
  req.subject.id = hash(req.subject.id.toString());
  next();
};

module.exports = {
  requireSubjectId,
  transformSubjectId,
  verifyJWT: jwtMiddlewareFactory('subject', subjectJWT)
};
