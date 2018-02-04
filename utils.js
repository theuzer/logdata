const config = require('./config');

const format = (number) => {
  if (number.toString().length === 1) {
    return `0${number.toString()}`;
  }
  return number;
};

const getUrl = (startDateString, endDateString, i) => {
  let url = `${config.api.url.base}?${config.api.url.start}${startDateString}&${config.api.url.end}${endDateString}`;
  if (i !== 0) {
    const offset = i * 5;
    url = `${url}&${config.api.url.page}${offset}`;
  }
  return url;
};

const getConfig = i => ({
  headers: {
    Authorization: config.api.keys[i % Object.keys(config.api.keys).length],
    Accept: config.api.accept,
  },
});

exports.getDateString = moment => `${moment.year()}-${format(moment.month() + 1)}-${format(moment.date())}T${format(moment.hour())}:${format(moment.minute())}:00Z`;

exports.buildApiCallInfo = (startDateString, endDateString, i) => {
  const url = getUrl(startDateString, endDateString, i);
  const apiConfig = getConfig(i);
  return { url, apiConfig };
};

exports.handleApiError = (error) => {
  let errorMessage;
  if (error.status === config.api.errors.noResults.code) {
    errorMessage = `error: ${error.status}, ${error.data.errors[0].title}, ${error.data.errors[0].detail}`;
  } else if (error.status === config.api.errors.noCall.code) {
    errorMessage = `error: ${error.status}, ${config.api.errors.noCall.message}`;
  } else {
    errorMessage = `error: ${error.status}`;
  }
  console.log(errorMessage);
  return `error: ${error.status}`;
};
