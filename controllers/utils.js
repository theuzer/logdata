const sql = require('mssql');

exports.azureDateBuilder = (year, month, day, hour, minute, second) => `${year}-${month}-${day} ${hour}:${minute}:${second}`;

exports.doQuery = (query) => {
  new sql.Request().query(query)
    .then(() => {
    })
    .catch((err) => {
      console.log(err);
    });
};
