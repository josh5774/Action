require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 4000;
const allowedOrigins =
  process.env.CORS_ORIGIN?.split(',').map((origin) => origin.trim()) || ['http://localhost:5173'];

app.use(helmet());
app.use(cors({ origin: allowedOrigins }));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/events', require('./routes/events'));
app.use('/api/articles', require('./routes/articles'));
app.use('/api/classes', require('./routes/classes'));

app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: '@action/backend',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: '@action/backend',
    timestamp: new Date().toISOString(),
  });
});

app.use((_req, res) => res.status(404).json({ error: 'Not found' }));

app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Action backend running on http://localhost:${PORT}`);
});

module.exports = app;
