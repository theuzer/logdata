const express = require('express');
const ontime = require('ontime');

//const mongoose = require('./database/mongoDb');
const sql = require('./database/azureDb');
const logic = require('./logic/logic');

const port = process.env.PORT || 5000;

const app = express();

app.listen(port, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`Server listening on port ${port}`);
  }
});

app.get('/', (req, res) => {
  res.send('working');
});

ontime({
  cycle: ['0'],
}, (ot) => {
  logic.getGameData();
  ot.done();
});
