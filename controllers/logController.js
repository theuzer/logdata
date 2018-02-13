const Log = require('../models/log');

// Mongo DB
exports.createLog = (message) => {
  const newLog = new Log();
  newLog.message = message;

  newLog.save((err) => {
    if (err) {
      throw err;
    }
  });
};
