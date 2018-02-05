const express = require('express');
const https = require('https');
const ontime = require('ontime');

const logic = require('./logic/logic');

// initialize Mongo DB connection
//  require('./database/mongoDb');

// initalize Azure DB connection
require('./database/azureDb');

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

// Keep app awake in Heroku
if (process.env.HEROKU_TIMER_CREATE === 'TRUE') {
  setInterval(() => {
    https.get(process.env.HEROKU_APP_URL);
    console.log('a');
  }, parseInt(process.env.HEROKU_APP_TIMER, 10));
}

ontime({
  cycle: ['0'],
}, (ot) => {
  logic.getGameData();
  ot.done();
});
