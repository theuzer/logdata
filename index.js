const express = require('express');
const https = require('https');
const ontime = require('ontime');

const logic = require('./logic/logic');

// initialize Mongo DB connection
require('./database/mongoDb');

// initialize Azure DB connection
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
    console.log('Pinged application');
  }, parseInt(process.env.HEROKU_APP_TIMER, 10));
}

const keySet1 = [process.env.KEY_0, process.env.KEY_1, process.env.KEY_2, process.env.KEY_3, process.env.KEY_4];
const keySet2 = [process.env.KEY_5, process.env.KEY_6, process.env.KEY_7, process.env.KEY_8, process.env.KEY_9];

ontime({
  cycle: ['0'],
}, (ot) => {
  logic.getGameData(-1, keySet1, 1);
  logic.getGameData(-2, keySet2, 2);
  ot.done();
});
