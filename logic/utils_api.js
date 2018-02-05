const constants = require('./constants');

exports.getUrl = (startDateString, endDateString, i) => {
  let url = `${constants.api.url.base}?${constants.api.url.start}${startDateString}&${constants.api.url.end}${endDateString}`;
  if (i !== 0) {
    const offset = i * 5;
    url = `${url}&${constants.api.url.page}${offset}`;
  }
  return url;
};

exports.getConfig = (i) => {
  let key;
  switch (i % 5) {
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
    case 4:
      key = process.env.KEY_4;
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
