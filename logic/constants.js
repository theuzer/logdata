module.exports = {
  api: {
    accept: 'application/vnd.api+json',
    url: {
      base: 'https://api.dc01.gamelockerapp.com/shards/global/matches',
      start: 'filter[createdAt-start]=',
      end: 'filter[createdAt-end]=',
      page: 'page[offset]=',
    },
    errors: {
      noResults: {
        code: 404,
      },
      noCall: {
        code: 429,
        message: 'API call limit exceeded',
      },
    },
  },
  azure: {
    insert: {
      block1: "INSERT INTO Game (GameId, DateCreated, Mode, Patch, MapId, Type, ServerType, RankedType, Stats) VALUES ('",
      comma: "','",
      block2: "');",
    },
  },
};
