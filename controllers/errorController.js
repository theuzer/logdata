const LogError = require('../models/error');
const constants = require('./constants');
const utils = require('./utils');

// Mongo DB
exports.createErrorMongo = (errorMessage, attemptToSave) => {
  const newError = new LogError();
  newError.errorMessage = errorMessage;
  newError.attemptToSave = attemptToSave;

  newError.save((err) => {
    if (err) {
      throw err;
    }
  });
};

// Azure DB
const insertErrorQueryBuilder = statusCode => [constants.azure.insertError, statusCode, constants.azure.endBlock_Int].join("");

const insertErrorMoreInfoQueryBuilder = (statusCode, info) => [constants.azure.insertErrorMoreInfo, statusCode, ",'", info, constants.azure.endBlock_String].join("");

exports.createErrorAzure = (statusCode, info) => {
  let query;
  if (info !== null) {
    query = insertErrorMoreInfoQueryBuilder(statusCode, info);
  } else {
    query = insertErrorQueryBuilder(statusCode);
  }

  utils.doQuery(query);
};
