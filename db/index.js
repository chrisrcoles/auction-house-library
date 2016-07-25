'use strict';
let pg = require('pg');

const pool = new pg.Pool({
  host: process.env.POSTGRES_DB_HOST,
  user: process.env.POSTGRES_DB_USER,
  port: process.env.POSTGRES_DB_PORT,
  password: process.env.POSTGRES_DB_PASS,
  database: process.env.POSTGRES_DB_NAME
});

/*
*
* #query is a public method that is used to query the PG client, maximizing
* for multiple db threads. Handles efficiency for highly queried application.
*
*
* @param {String} query - Postgres Qury
* @param {Array} values - Values to prevent sql injection
* @param {Function} cb  - Callback function
* */
module.exports = {
  query: (query, values, cb) => {
    console.log(`QUERY : ${query} with \n VALUES : ${values}`);

    pool.connect((err, client, done) => {
      if (err) throw err;

      client.query(query, values, (err, result) => {
        done();
        cb(err, result)
      });
    })
  }
};

