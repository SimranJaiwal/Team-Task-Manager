// Vercel serverless entry — serves API + React build
process.env.NODE_ENV = process.env.NODE_ENV || 'production';
module.exports = require('../backend/server');
