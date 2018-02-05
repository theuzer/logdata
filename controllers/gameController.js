const sql = require('mssql');

const Game = require('../models/game');
const constants = require('../logic/constants');

//
// AZURE SQL DATABASE HELP FUNCTIONS
//
const dateBuilder = (year, month, day, hour, minute, second) => `${year}-${month}-${day} ${hour}:${minute}:${second}`;

const insertGameQueryBuilder = (game) => {
  const gameDate = dateBuilder(game.gameYear, game.gameMonth, game.gameDay, game.gameHour, game.gameMinute, game.gameSecond);
  const logDate = dateBuilder(game.logYear, game.logMonth, game.logDay, game.logHour, game.logMinute, game.logSecond);
  return [constants.azure.insert.block1, game.gameId, constants.azure.insert.comma, logDate, constants.azure.insert.comma, gameDate, constants.azure.insert.comma, game.mode, constants.azure.insert.comma, game.patch, constants.azure.insert.comma, game.map, constants.azure.insert.comma, game.type, constants.azure.insert.comma, game.serverType, constants.azure.insert.comma, game.rankedType, constants.azure.insert.comma, game.stats, constants.azure.insert.block2].join("");
};

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

// TODO Bulk insert
exports.createGameAzure = (game) => {
  const query = insertGameQueryBuilder(game);

  new sql.Request().query(query)
    .then((result) => {
      console.log('good');
    })
    .catch((err) => {
      console.log('bad');
    });
};
