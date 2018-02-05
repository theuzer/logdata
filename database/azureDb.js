const sql = require('mssql');

const config = {
  server: process.env.DB_AZURE_SERVER,
  database: process.env.DB_AZURE_DATABASE,
  user: process.env.DB_AZURE_USERNAME,
  password: process.env.DB_AZURE_PASSWORD,
  port: 1433,
  options: { encrypt: true },
};

sql.connect(config);

module.exports = sql;
