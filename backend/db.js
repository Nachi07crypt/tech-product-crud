

require('dotenv').config();
const { DatabaseSync } = require('node:sqlite');
const fs = require('fs');
const path = require('path');

const db = new DatabaseSync(process.env.DB_FILE || './products.db');
const sql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');

// split off the seed INSERT so it only runs when the table is empty
const [ddl, seed] = sql.split('-- Sample data');
db.exec(ddl);
const { n } = db.prepare('SELECT COUNT(*) AS n FROM products').get();
if (n === 0 && seed) db.exec(seed.substring(seed.indexOf('INSERT')));

module.exports = db;