const { Pool } = require('pg');
require('dotenv').config();
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

pool.connect((err, client, done) => {
    if (err) {
        console.error('Database connection error:', err.message, err.stack);
        // Log the error to a file or external service in a production environment
    } else {
        console.log('Connected to PostgreSQL');
    }
    if (client) {
        done();
    }
});

pool.on('error', (err, client) => {
    console.error('idle client error', err.message, err.stack);
});
module.exports = pool;
