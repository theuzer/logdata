const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const NotLoggedGameSchema = new Schema({
  gameId: String,
});

module.exports = mongoose.model('NotLoggedGame', NotLoggedGameSchema);

