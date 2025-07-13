// quiz-service/index.js
const app = require('./app');

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log(`Quiz Service running on port ${PORT}`);
});
