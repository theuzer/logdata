const moment = require('moment');
const axios = require('axios');

const errorHandling = require('./errorHandling');
const gameController = require('../controllers/gameController');
const dateUtils = require('./utils_date');
const apiUtils = require('./utils_api');

const mapGame = (startDateString, game, included) => {
  const gameDate = dateUtils.getIndividualDateFields(game.attributes.createdAt);
  const logDate = dateUtils.getIndividualDateFields(startDateString);
  const asset = included.find(x => x.id === game.relationships.assets.data[0].id);
  return {
    gameId: game.id,
    gameYear: gameDate.year,
    gameMonth: gameDate.month,
    gameDay: gameDate.day,
    gameHour: gameDate.hour,
    gameMinute: gameDate.minute,
    gameSecond: gameDate.second,
    logYear: logDate.year,
    logMonth: logDate.month,
    logDay: logDate.day,
    logHour: logDate.hour,
    logMinute: logDate.minute,
    logSecond: logDate.second,
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

const processResponse = (startDateString, response) => {
  response.data.data.forEach((game) => {
    const gameOut = mapGame(startDateString, game, response.data.included);
    gameController.createGameAzure(gameOut);
  });
};

const buildApiCallInfo = (startDateString, endDateString, keySet, i) => {
  const url = apiUtils.getUrl(startDateString, endDateString, i);
  const apiConfig = apiUtils.getConfig(keySet, i);
  return { url, apiConfig };
};

const callApi = (startDateString, endDateString, keySet, i) => {
  const apiCallInfo = buildApiCallInfo(startDateString, endDateString, keySet, i);

  axios.get(apiCallInfo.url, apiCallInfo.apiConfig)
    .then((response) => {
      // console.log(`success on call api: ${i} ${apiCallInfo.url}`);
      callApi(startDateString, endDateString, keySet, i + 1);
      processResponse(startDateString, response);
    })
    .catch((err) => {
      errorHandling.handleApiError(err);
    });
};

exports.getGameData = (daysLess, keySet) => {
  // startDate is now minus 1 day, endDate is startDate plus 1 minute.
  const startDate = moment().add(daysLess, 'd');
  const endDate = moment().add(daysLess, 'd').add(1, 'm');
  const startDateString = dateUtils.getDateString(startDate);
  const endDateString = dateUtils.getDateString(endDate);
  console.log(startDateString, endDateString);
  callApi(startDateString, endDateString, keySet, 0);
};
