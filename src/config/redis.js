const redis = require('redis');
const config = require('./environment');

const client = redis.createClient({
  socket: {
    host: config.REDIS.host,
    port: config.REDIS.port,
  },
});

client.on('error', (err) => console.log('Redis Client Error', err));
client.connect();

module.exports = client;
