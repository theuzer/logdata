const errorController = require('../controllers/errorController');
const constants = require('./constants');

exports.handleApiError = (error) => {
  let errorMessage;
  if (typeof error.response !== 'undefined' && typeof error.response.status !== 'undefined') {
    if (error.response.status === constants.api.errors.noResults.code) {
      errorMessage = `error: ${error.response.status}, ${error.response.data.errors[0].title}, ${error.response.data.errors[0].detail}`;
      if (error.response.data.errors[0].detail !== constants.api.errors.noResults.message) {
        errorController.createErrorAzure(error.response.status, null);
      }
    } else if (error.response.status === constants.api.errors.noCall.code) {
      errorMessage = `error: ${error.response.status}, ${constants.api.errors.noCall.message}`;
      errorController.createErrorAzure(error.response.status, null);
    } else {
      errorMessage = `error: ${error.response.status}`;
      errorController.createErrorAzure(error.response.status, null);
    }
  } else {
    errorMessage = error;
  }

  console.log(errorMessage);
  return errorMessage;
};
