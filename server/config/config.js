const { Pool } = require('pg');

const pool = new Pool({
  user: 'ioslpg@ioslpg',
  host: 'ioslpg.postgres.database.azure.com',
  database: 'artvalue',
  password: 'Wcdima2@123456',
  port: 5432,
  ssl: true,
});



const twitterConfig = {
  consumer_key: 'rAM9pQx6QlaqrleNVwc4Ai65K',
  consumer_secret: 'm4ODRLD9OOSjDWaABggC61jFqOeI9ADRk151N5mZj5ZHaiqdey',
  access_token_key: '1003834827668217858-Mhc69mVQZGBoKPH4wi6p5ph8YjI8Ki',
  access_token_secret: 'WHm37Tnft9LSXGmRKyD629zx30TyP391C8MeE0jwaVesu'
}

module.exports = {
  pool,
  twitterConfig
};
