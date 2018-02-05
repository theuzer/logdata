module.exports = {
  azure: {
    comma: "','",
    endBlock_String: "');",
    endBlock_Int: ");",
    insertGame: "INSERT INTO Game (GameId, LogDate, GameDateCreated, Mode, Patch, MapId, Type, ServerType, RankedType, Stats) VALUES ('",
    insertError: "INSERT INTO Error (StatusCode) VALUES (",
    insertErrorMoreInfo: "INSERT INTO Error (StatusCode, Info) VALUES (",
  },
};
