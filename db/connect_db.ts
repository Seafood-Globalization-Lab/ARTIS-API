// Modules
// const config = require('config');
const pgp = require('pg-promise')();
const dotenv = require('dotenv').config();

// POSTGRES Database Connection-------------------------------------------------
// log in data for ARTIS data base connection
const ssl = { rejectUnauthorized: false };
let cn = null;
// create database connection based on environment variables
if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
    // connection object
    cn = {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        port: process.env.DB_PORT,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    };
}
// specific production database variables added
if (process.env.NODE_ENV === 'production') {
    cn = {
        connectionString: process.env.DATABASE_URL,
        max: 30,
        ssl: ssl,
    };
}
//----------------------------------------------------------------------------------------

// Connecting to database
export const db = pgp(cn);

// Send Request over to PostgresSQL database
export const makePgRequest = async (query: string) => {
    try {
        // sending request over to the database
        return await db.any(query);
    } catch (e) {
        // throwing any errors that occur
        throw new Error(e);
    }
};
