const sql = require('mssql');

const Game = require('../models/game');
const constants = require('./constants');
const utils = require('./utils');
const notLoggedGameController = require('./notLoggedGameController');

// Mongo DB
exports.createGameMongo = (game) => {
  const newGame = new Game();
  newGame.gameId = game.gameId;
  newGame.date = new Date(game.gameYear, game.gameMonth, game.gameDay, game.gameHour, game.gameMinute, game.gameSecond);
  newGame.duration = game.duration;
  newGame.mode = game.mode;
  newGame.patch = game.patch;
  newGame.map = game.map;
  newGame.type = game.type;
  newGame.rankedType = game.rankedType;
  newGame.serverType = game.serverType;
  newGame.stats = game.stats;

  newGame.save((err) => {
    if (err) {
      throw err;
    }
  });
};

// Azure DB
const insertGameQueryBuilder = (game) => {
  const gameDate = utils.azureDateBuilder(game.gameYear, game.gameMonth, game.gameDay, game.gameHour, game.gameMinute, game.gameSecond);
  const logDate = utils.azureDateBuilder(game.logYear, game.logMonth, game.logDay, game.logHour, game.logMinute, game.logSecond);
  return [constants.azure.insertGame, game.gameId, constants.azure.comma, logDate, constants.azure.comma, gameDate, constants.azure.comma, game.mode, constants.azure.comma, game.patch, constants.azure.comma, game.map, constants.azure.comma, game.type, constants.azure.comma, game.serverType, constants.azure.comma, game.rankedType, constants.azure.comma, game.stats, constants.azure.endBlock_String].join("");
};

// TODO Bulk insert
exports.createGameAzure = (game) => {
  const query = insertGameQueryBuilder(game);

  new sql.Request().query(query)
    .catch((err) => {
      if (err.code === constants.azure.requestErrorCode) {
        console.log(`error inserting ${game.gameId}`);
      }
    });

  let numberOfRetries = constants.azure.numberOfRetries;

  sql.on('error', (err) => {
    if (err.code === constants.azure.timeoutErrorCode) {
      if (numberOfRetries > 0) {
        setTimeout(() => {
          numberOfRetries -= 1;
          new sql.Request().query(query);
        }, 30000);
      } else {
        notLoggedGameController.createNotLoggedGame(game.gameId);
      }
    }
  });
};
