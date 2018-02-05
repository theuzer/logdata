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
        message: 'No matches found matching criteria',
      },
      noCall: {
        code: 429,
        message: 'API call limit exceeded',
      },
    },
  },
  azure: {
    comma: "','",
    endBlock_String: "');",
    endBlock_Int: ");",
    insertGame: "INSERT INTO Game (GameId, LogDate, GameDateCreated, Mode, Patch, MapId, Type, ServerType, RankedType, Stats) VALUES ('",
    insertError: "INSERT INTO Error (StatusCode) VALUES (",
    insertErrorMoreInfo: "INSERT INTO Error (StatusCode, Info) VALUES (",
  },
};
