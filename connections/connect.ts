
// Modules
const config = require('config');
const pgp = require('pg-promise')();

// log in data for ARTIS data base connection
const cn = config.get('artis_db_cn');
// Connecting to database
export const db = pgp(cn);

// Sciname columns
export const scinameCols = [
    'sciname', 'common_name', 'genus', 'subfamily', 
    'family', 'order', 'class', 'superclass', 'phylum',
    'kingdom', 'isscaap'
];