const Game = require('../models/game');

exports.createGame = (game) => {
  const newGame = new Game();
  newGame.gameId = game.gameId;
  newGame.date = game.date;
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
