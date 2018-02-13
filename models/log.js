const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const LogSchema = new Schema({
  date_created: { type: Date, default: Date.now },
  message: String,
});

module.exports = mongoose.model('Log', LogSchema);
