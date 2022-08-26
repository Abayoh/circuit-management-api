const createError = require('http-errors');

module.exports.validateId = (req, res, next) => {
  const { id } = req.params;

  try {
    if (!id.match(/^[0-9a-fA-F]{24}$/))
      throw createError.BadRequest('invalid objectId');
    next();
  } catch (err) {
    next(err);
  }
};
