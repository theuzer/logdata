const constants = require('./constants');

const getUrl = (startDateString, endDateString, i) => {
  let url = `${constants.api.url.base}?${constants.api.url.start}${startDateString}&${constants.api.url.end}${endDateString}`;
  if (i !== 0) {
    const offset = i * 5;
    url = `${url}&${constants.api.url.page}${offset}`;
  }
  return url;
};

const getConfig = (keySet, i) => ({
  headers: {
    Authorization: keySet[i % keySet.length],
    Accept: constants.api.accept,
  },
});

exports.buildApiCallInfo = (startDateString, endDateString, keySet, i) => {
  const url = getUrl(startDateString, endDateString, i);
  const apiConfig = getConfig(keySet, i);
  return { url, apiConfig };
};
