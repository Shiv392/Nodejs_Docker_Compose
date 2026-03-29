const redis = require('redis');

const redis_client = redis.createClient({
socket : {
    host : 'redis', //container name of the redis image container  in docker-compose.yml file.
    port : 6379
}
});

module.exports = redis_client;