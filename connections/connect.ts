
const config = require('config');
const pgp = require('pg-promise')();

// log in data for ARTIS data base connection
const cn = config.get('artis_db_cn');
// Connecting to database
const db = pgp(cn);

export default db;