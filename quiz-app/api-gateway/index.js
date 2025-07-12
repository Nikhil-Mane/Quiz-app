const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();

// Proxy to User Service
app.use('/api/auth', createProxyMiddleware({
  target: 'http://user-service:3001',
  changeOrigin: true,
  pathRewrite: { '^/api/auth': '' }
}));

// Proxy to Quiz Service
app.use('/api/quizzes', createProxyMiddleware({
  target: 'http://quiz-service:3002',
  changeOrigin: true,
  pathRewrite: { '^/api/quizzes': '' }
}));

app.listen(3000, () => console.log('API Gateway running on port 3000'));
