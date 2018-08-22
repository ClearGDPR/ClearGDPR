const {
  getSubjectDataState
} = require('../../utils/blockchain');

const {
  NotFound
} = require('../../utils/errors');

const isSubjectErased = async (req, res, next) => {
  const controllerStatus = await getSubjectDataState(req.subject.id);

  if (controllerStatus === 2) {
    return next(new NotFound('Subject is erased'));
  }

  next();
};

module.exports = {
  isSubjectErased
};
