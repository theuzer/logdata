const constants = require('./constants');

exports.getUrl = (startDateString, endDateString, i) => {
  let url = `${constants.api.url.base}?${constants.api.url.start}${startDateString}&${constants.api.url.end}${endDateString}`;
  if (i !== 0) {
    const offset = i * 5;
    url = `${url}&${constants.api.url.page}${offset}`;
  }
  return url;
};

exports.getConfig = (keySet, i) => ({
  headers: {
    Authorization: keySet[i % keySet.length],
    Accept: constants.api.accept,
  },
});
