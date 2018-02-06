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
