const express = require('express');
const axios = require('axios');
const ontime = require('ontime');
const moment = require('moment');

const utils = require('./utils');

const port = process.env.PORT || 5000;

const app = express();

app.listen(port, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`Server listening on port ${port}`);
  }
});

// test

const callApi = (startDateString, endDateString, i) => {
  const apiCallInfo = utils.buildApiCallInfo(startDateString, endDateString, i);

  axios.get(apiCallInfo.url, apiCallInfo.apiConfig)
    .then(() => {
      console.log(`success: ${i}`);
      callApi(startDateString, endDateString, i + 1);
    })
    .catch((err) => {
      utils.handleApiError(err.response);
    });
};

const getGameData = () => {
  // startDate is now minus 1 day, endDate is startDate plus 1 minute.
  const startDate = moment().add(-1, 'd');
  const endDate = moment().add(-1, 'd').add(1, 'm');
  const startDateString = utils.getDateString(startDate);
  const endDateString = utils.getDateString(endDate);
  callApi(startDateString, endDateString, 0);
};

ontime({
  cycle: ['0'],
}, (ot) => {
  getGameData();
  ot.done();
});
