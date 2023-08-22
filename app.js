require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const helmet = require('helmet');
const routes = require('./routes');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const handleError = require('./middlewares/handleError');
const limiter = require('./middlewares/rateLimiter');

const app = express();
const {
  PORT, DATA_MOVIES,
} = require('./utils/config');

mongoose.connect(DATA_MOVIES, {
  useNewUrlParser: true,
});

app.use(helmet());
app.use(limiter);
app.use(express.json());
app.use(requestLogger);
app.use('/', routes);
app.use(errorLogger);
app.use(errors());
app.use(handleError);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
