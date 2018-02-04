const Error = require('../models/error');

exports.createError = (statusCode) => {
  const newError = new Error();
  newError.status_code = statusCode;

  newError.save((err) => {
    if (err) {
      throw err;
    }
  });
};
