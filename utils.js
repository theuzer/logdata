const constants = require('./constants');
const errorController = require('./controllers/errorController');

const format = (number) => {
  if (number.toString().length === 1) {
    return `0${number.toString()}`;
  }
  return number;
};

const getUrl = (startDateString, endDateString, i) => {
  let url = `${constants.api.url.base}?${constants.api.url.start}${startDateString}&${constants.api.url.end}${endDateString}`;
  if (i !== 0) {
    const offset = i * 5;
    url = `${url}&${constants.api.url.page}${offset}`;
  }
  return url;
};

const getConfig = (i) => {
  let key;
  switch (i % 4) {
    case 0:
      key = process.env.KEY_0;
      break;
    case 1:
      key = process.env.KEY_1;
      break;
    case 2:
      key = process.env.KEY_2;
      break;
    case 3:
      key = process.env.KEY_3;
      break;
    default:
      key = process.env.KEY_0;
  }

  return {
    headers: {
      Authorization: key,
      Accept: constants.api.accept,
    },
  };
};

exports.getDateString = moment => `${moment.year()}-${format(moment.month() + 1)}-${format(moment.date())}T${format(moment.hour())}:${format(moment.minute())}:00Z`;

exports.buildApiCallInfo = (startDateString, endDateString, i) => {
  const url = getUrl(startDateString, endDateString, i);
  const apiConfig = getConfig(i);
  return { url, apiConfig };
};

exports.handleApiError = (error) => {
  let errorMessage;
  if (typeof error.response !== 'undefined' && typeof error.response.status !== 'undefined') {
    if (error.response.status === constants.api.errors.noResults.code) {
      errorMessage = `error: ${error.response.status}, ${error.response.data.errors[0].title}, ${error.response.data.errors[0].detail}`;
    } else if (error.response.status === constants.api.errors.noCall.code) {
      errorMessage = `error: ${error.response.status}, ${constants.api.errors.noCall.message}`;
      errorController.createError(error.response.status);
    } else {
      errorMessage = `error: ${error.response.status}`;
    }
  } else {
    errorMessage = error;
  }

  console.log(errorMessage);
  return errorMessage;
};
