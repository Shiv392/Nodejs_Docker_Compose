const express = require('express');
const port = process.env.PORT || 3000;
const app = express();
const mysql_pool = require('./config/db_config');
const redis_client = require('./config/redis_config');
const logger = require('./logger');

// Test MySQL connection at startup
mysql_pool.getConnection((err, connection) => {
  if (err) {
    logger.error('Error connecting to MySQL:', err.message);
  } else {
    logger.info('Connected to MySQL database');
    connection.release(); // release initial connection
  }
});

// Redis connection events
redis_client.on('error', (err) => {
  logger.error('Redis connection error:', err);
});
redis_client.on('connect', () => {
  logger.info('Connected to Redis database');
});

// API endpoint
app.get('/', async (req, res) => {
  const nameKey = req.query.name;
  if (!nameKey) {
    return res.status(400).json({ message: 'Name query parameter is required' });
  }

  logger.info('API endpoint / called with query: %s', nameKey);

  try {
    // 1️⃣ Check Redis cache first
        logger.info('first', nameKey);
    const cachedData = await redis_client.get(nameKey);
    logger.info('API endpoint / called with query: %s', nameKey);
    if (cachedData) {
      logger.info('Data retrieved from Redis cache for %s', nameKey);
      return res.json({ source: 'redis', data: JSON.parse(cachedData) });
    }

    // 2️⃣ Query MySQL if not in Redis
    const [rows] = await mysql_pool.promise().query(
      'SELECT * FROM user WHERE name = ?',
      [nameKey]
    );

    if (rows.length === 0) {
      const email = `${nameKey}@example.com`;
      await mysql_pool.promise().query(
        'INSERT INTO user (name, email) VALUES (?, ?)',
        [nameKey, email]
      );
      logger.info('New user created in MySQL database with name: %s', nameKey);
      return res.status(201).json({ message: 'New User created' });
    }

    const userData = rows[0];

    // 3️⃣ Cache result in Redis
    await redis_client.set(nameKey, JSON.stringify(userData), { EX: 60 * 5 }); // 5 min TTL
    logger.info('Data from MySQL cached in Redis for %s', nameKey);

    res.json({ source: 'mysql', data: userData });
  } catch (err) {
    logger.error('Error processing request for %s: %O', nameKey, err);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
});

// Graceful shutdown
process.on('SIGINT', async () => {
  logger.info('Shutting down gracefully...');
  await redis_client.quit();
  await mysql_pool.end();
  process.exit(0);
});

app.listen(port, () => {
  logger.info(`Server is running at http://localhost:${port}`);
});