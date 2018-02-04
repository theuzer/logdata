const express = require('express');
const axios = require('axios');
const ontime = require('ontime');
const moment = require('moment');

const mongoose = require('./database/index');
const utils = require('./utils');
const gameController = require('./controllers/gameController');

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

// test

const processResponse = (response) => {
  response.data.data.forEach((game) => {
    const date = game.attributes.createdAt.split('T');
    const date1 = date[0].split('-');
    const date2 = date[1].slice(0, -1).split(':');
    const year = Number(date1[0]);
    const month = Number(date1[1]);
    const day = Number(date1[2]);
    const hour = Number(date2[0]);
    const minute = Number(date2[1]);
    const second = Number(date2[2]);
    const asset = response.data.included.find(x => x.id === game.relationships.assets.data[0].id);
    const gameOut = {
      gameId: game.id,
      date: new Date(year, month, day, hour, minute, second),
      duration: game.attributes.duration,
      mode: game.attributes.gameMode,
      patch: game.attributes.patchVersion,
      map: game.attributes.stats.mapID,
      type: game.attributes.stats.type,
      rankedType: game.attributes.tags.rankingType,
      serverType: game.attributes.tags.serverType,
      stats: asset.attributes.URL,
    };
    gameController.createGame(gameOut);
  });
};

const callApi = (startDateString, endDateString, i) => {
  const apiCallInfo = utils.buildApiCallInfo(startDateString, endDateString, i);

  axios.get(apiCallInfo.url, apiCallInfo.apiConfig)
    .then((response) => {
      console.log(`success: ${i}`);
      callApi(startDateString, endDateString, i + 1);
      processResponse(response);
    })
    .catch((err) => {
      utils.handleApiError(err);
    });
};

const getGameData = () => {
  // startDate is now minus 1 day, endDate is startDate plus 1 minute.
  const startDate = moment().add(-1, 'd');
  const endDate = moment().add(-1, 'd').add(1, 'm');
  const startDateString = utils.getDateString(startDate);
  const endDateString = utils.getDateString(endDate);
  console.log(startDateString, endDateString);
  callApi(startDateString, endDateString, 0);
};

ontime({
  cycle: ['0'],
}, (ot) => {
  getGameData();
  ot.done();
});
