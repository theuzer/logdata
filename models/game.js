const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const GameSchema = new Schema({
  gameId: String,
  date: Date,
  duration: Number,
  mode: String,
  patch: String,
  map: String,
  type: String,
  rankedType: String,
  serverType: String,
  stats: String,
});

module.exports = mongoose.model('Game', GameSchema);

