const mysql = require('mysql2');

const pool = mysql.createPool({
  connectionLimit: 10,
  host: '10.89.240.65', // IP ou localhost
  user: 'alunods', // alunods
  password: 'senai@604', // 
  database: 'agenda_sala_senai'
});

module.exports = pool;
