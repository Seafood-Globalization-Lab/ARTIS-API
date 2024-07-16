
// Modules
// const config = require('config');
const pgp = require('pg-promise')();
const dotenv = require('dotenv').config();
const { Queue } = require('bullmq');


// POSTGRES Database Connection-------------------------------------------------
// log in data for ARTIS data base connection
const ssl = {rejectUnauthorized: false};
let cn = null;
// create database connection based on environment variables
if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
    // connection object
    cn = {
        "host": process.env.DB_HOST,
        "user": process.env.DB_USER,
        "port": process.env.DB_PORT,
        "password": process.env.DB_PASSWORD,
        "database": process.env.DB_NAME
    };
}
// specific production database variables added
if (process.env.NODE_ENV === 'production') {
    cn = {
        connectionString: process.env.DATABASE_URL,
        max: 30,
        ssl: ssl
    };
}
//----------------------------------------------------------------------------------------

// redis database config options----------------------------------------------------------
export let redisOptions = null;

if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'testing') {
    redisOptions = {
        host: String(process.env.REDIS_HOST),
        port: Number(process.env.REDIS_PORT)
    };
}

if (process.env.NODE_ENV === 'production') {
    const redis_tls_url = process.env.REDIS_TLS_URL
    // Get host from redis tls url
    const host_regex = RegExp("@(.*):")
    const host_matches = host_regex.exec(redis_tls_url)
    const hostname = host_matches[1]
    // Get password from redis tls url
    const pw_regex = RegExp("\/\/:(.*)@")
    const pw_matches = pw_regex.exec(redis_tls_url)
    const pw = pw_matches[1]
    // Get port from redis tls url
    const port_regex = RegExp(":([0-9]*)$")
    const port_matches = port_regex.exec(redis_tls_url)
    const port = port_matches[1]

    redisOptions = {
        host: hostname,
        port: port,
        password: pw,
        tls: {
            rejectUnauthorized: false
          }
    }
}

//----------------------------------------------------------------------------------------

// Connecting to database
export const db = pgp(cn);

// Send Request over to PostgresSQL database
export const makePgRequest = async (query: string) => {
    try {
        // sending request over to the database
        return await db.any(query);
    }
    catch(e) {
        // throwing any errors that occur
        throw new Error(e);
    }
}

