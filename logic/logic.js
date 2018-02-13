const moment = require('moment');
const axios = require('axios');

const errorHandling = require('./errorHandling');
const gameController = require('../controllers/gameController');
const logController = require('../controllers/logController');
const dateUtils = require('./utils_date');
const apiUtils = require('./utils_api');
const constants = require('./constants');

const results1 = [];
const results2 = [];

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

const processResponse = (startDateString, response, processNumber) => {
  if (processNumber === 1) {
    response.data.data.forEach((game) => {
      const gameOut = mapGame(startDateString, game, response.data.included);
      results1.push(gameOut);
      // gameController.createGameAzure(gameOut);
    });
  } else {
    response.data.data.forEach((game) => {
      const gameOut = mapGame(startDateString, game, response.data.included);
      results2.push(gameOut);
      // gameController.createGameAzure(gameOut);
    });
  }
};

const callApi = (startDateString, endDateString, keySet, i, processNumber) => {
  const apiCallInfo = apiUtils.buildApiCallInfo(startDateString, endDateString, keySet, i);

  axios.get(apiCallInfo.url, apiCallInfo.apiConfig)
    .then((response) => {
      processResponse(startDateString, response, processNumber);
      console.log(`${startDateString} ${response.data.data.length}`);
    })
    .then(() => {
      callApi(startDateString, endDateString, keySet, i + 1, processNumber);
    })
    .catch((err) => {
      if (err.response.status === constants.api.errors.noResults.code) {
        console.log(`ended api calls ${startDateString}`);
        if (processNumber === 1) {
          console.log(`going to bulk insert ${results1.length} games on process 1`);
          gameController.bulkCreateGamesAzure(results1);
          results1.length = 0;
        } else {
          console.log(`going to bulk insert ${results2.length} games on process 2`);
          gameController.bulkCreateGamesAzure(results2);
          results2.length = 0;
        }
      } else {
        errorHandling.handleApiError(err);
      }
    });
};

exports.getGameData_daysLess = (daysLess, keySet, processNumber) => {
  const startDate = moment().add(daysLess, 'd');
  const endDate = moment().add(daysLess, 'd').add(1, 'm');
  const startDateString = dateUtils.getDateString(startDate);
  const endDateString = dateUtils.getDateString(endDate);
  console.log(startDateString, endDateString);
  logController.createLog(`${startDateString} ${endDateString}`);
  callApi(startDateString, endDateString, keySet, 0, processNumber);
};

exports.getGameData_minutesLess = (minutesLess, keySet, processNumber) => {
  const startDate = moment().add(minutesLess, 'm');
  const endDate = moment().add(minutesLess, 'm').add(1, 'm');
  const startDateString = dateUtils.getDateString(startDate);
  const endDateString = dateUtils.getDateString(endDate);
  console.log(startDateString, endDateString);
  logController.createLog(`${startDateString} ${endDateString}`);
  callApi(startDateString, endDateString, keySet, 0, processNumber);
};
