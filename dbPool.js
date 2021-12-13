const mysql = require('mysql');

const pool  = mysql.createPool({
    connectionLimit: 10,
    host: "w3epjhex7h2ccjxx.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    user: "vpy55vqppn2asafl",
    password: "kinrxwpixu0aojxr",
    database: "f395wzaw0qggdv3j"
});

module.exports = pool;
