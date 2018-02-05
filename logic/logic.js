const moment = require('moment');
const axios = require('axios');

const constants = require('./constants');
const gameController = require('../controllers/gameController');
const errorController = require('../controllers/errorController');

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

const getDateString = m => `${m.year()}-${format(m.month() + 1)}-${format(m.date())}T${format(m.hour())}:${format(m.minute())}:00Z`;

const buildApiCallInfo = (startDateString, endDateString, i) => {
  const url = getUrl(startDateString, endDateString, i);
  const apiConfig = getConfig(i);
  return { url, apiConfig };
};

const handleApiError = (error) => {
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


const mapGame = (game, included) => {
  const date = game.attributes.createdAt.split('T');
  const date1 = date[0].split('-');
  const date2 = date[1].slice(0, -1).split(':');
  const asset = included.find(x => x.id === game.relationships.assets.data[0].id);
  return {
    gameId: game.id,
    year: Number(date1[0]),
    month: Number(date1[1]),
    day: Number(date1[2]),
    hour: Number(date2[0]),
    minute: Number(date2[1]),
    second: Number(date2[2]),
    duration: game.attributes.duration,
    mode: game.attributes.gameMode,
    patch: game.attributes.patchVersion,
    map: game.attributes.stats.mapID,
    type: game.attributes.stats.type,
    rankedType: game.attributes.tags.rankingType,
    serverType: game.attributes.tags.serverType,
    stats: asset.attributes.URL,
  };
};

const processResponse = (response) => {
  response.data.data.forEach((game) => {
    const gameOut = mapGame(game, response.data.included);
    //gameController.createGameMongo(gameOut);
    gameController.createGameAzure(gameOut);
  });
};

const callApi = (startDateString, endDateString, i) => {
  const apiCallInfo = buildApiCallInfo(startDateString, endDateString, i);

  axios.get(apiCallInfo.url, apiCallInfo.apiConfig)
    .then((response) => {
      console.log(`success: ${i}`);
      callApi(startDateString, endDateString, i + 1);
      processResponse(response);
    })
    .catch((err) => {
      handleApiError(err);
    });
};

exports.getGameData = () => {
  // startDate is now minus 1 day, endDate is startDate plus 1 minute.
  const startDate = moment().add(-1, 'd');
  const endDate = moment().add(-1, 'd').add(1, 'm');
  const startDateString = getDateString(startDate);
  const endDateString = getDateString(endDate);
  console.log(startDateString, endDateString);
  callApi(startDateString, endDateString, 0);
};
