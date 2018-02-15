const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const LogErrorSchema = new Schema({
  date_created: { type: Date, default: Date.now },
  errorMessage: String,
  attemptToSave: Number,
  queueLength: Number,
});

module.exports = mongoose.model('LogError', LogErrorSchema);

