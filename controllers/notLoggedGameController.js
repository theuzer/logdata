const NotLoggedGame = require('../models/notLoggedGame');

// Mongo DB
exports.createNotLoggedGame = (gameId) => {
  const newNotLoggedGame = new NotLoggedGame();
  newNotLoggedGame.gameId = gameId;

  newNotLoggedGame.save((err) => {
    if (err) {
      throw err;
    }
  });
};

exports.createNotLoggedGames = (games) => {
  const newNotLoggedGames = [];
  games.forEach((game) => {
    newNotLoggedGames.push(game.gameId);
  });

  NotLoggedGame.insertMany(newNotLoggedGames)
    .catch((err) => {
      throw err;
    });
};
