const mongoose = require('mongoose');
const dns = require('dns');

// Fix for querySrv ECONNREFUSED on MongoDB Atlas SRV connection strings
// Tells Node.js to use Google and Cloudflare Public DNS for SRV record lookups
try {
    dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (err) {
    console.warn('Failed to configure custom DNS servers:', err.message);
}

function connectToDb() {
    mongoose.connect(process.env.DB_CONNECT)
        .then(() => {
            console.log('Connected to DB');
        })
        .catch(err => {
            console.error('Database connection error:', err);
        });
}

module.exports = connectToDb;