const sql = require('mssql');

const Error = require('../models/error');
const constants = require('../logic/constants');

//
// AZURE SQL DATABASE HELP FUNCTIONS
//
const insertErrorQueryBuilder = statusCode => [constants.azure.insertError, statusCode, constants.azure.endBlock_Int].join("");

const insertErrorMoreInfoQueryBuilder = (statusCode, info) => [constants.azure.insertErrorMoreInfo, statusCode, ",'", info, constants.azure.endBlock_String].join("");

exports.createErrorMongo = (statusCode) => {
  const newError = new Error();
  newError.status_code = statusCode;

  newError.save((err) => {
    if (err) {
      throw err;
    }
  });
};

exports.createErrorAzure = (statusCode, info) => {
  let query;
  if (info !== null) {
    query = insertErrorMoreInfoQueryBuilder(statusCode, info);
  } else {
    query = insertErrorQueryBuilder(statusCode);
  }

  new sql.Request().query(query)
    .then(() => {
      console.log('good');
    })
    .catch((err) => {
      console.log(err);
    });
};
