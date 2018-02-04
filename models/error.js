const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ErrorSchema = new Schema({
  date_created: { type: Date, default: Date.now },
  status_code: Number,
});

module.exports = mongoose.model('Error', ErrorSchema);

