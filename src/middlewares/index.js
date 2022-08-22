const createError = require('http-errors');

module.exports.validateId = (req, res, next) => {
  const { id } = req.params;

  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    next();
  } else {
    next(createError.BadRequest("invalid objectId"));
  }
};

