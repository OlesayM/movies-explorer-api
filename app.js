require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const helmet = require('helmet');
const auth = require('./middlewares/auth');
const validation = require('./middlewares/validation');
const { login, createUser } = require('./controllers/users');
const middlewares = require('./middlewares/middlewares');
const limiter = require('./middlewares/rateLimiter');
const ErrNotFound = require('./errors/ErrNotFound'); // 404

const { PORT = 4000 } = process.env;
const app = express();

mongoose
  .connect('mongodb://127.0.0.1:27017/bitfilmsdb', { useNewUrlParser: true })
  .then(() => {
    console.log('База данных подключена');
  })
  .catch(() => {
    console.log('Не удалось подключиться к Базе данных');
  });
app.use(helmet());
app.use(limiter);
app.use(express.json());

app.post('/signin', validation.checkLogin, login);
app.post('/signup', validation.checkCreateUser, createUser);
app.use(auth);
app.use('/users', require('./routes/users'));
app.use('/movies', require('./routes/movies'));

app.use('*', auth, (req, res, next) => {
  next(new ErrNotFound('Страница не найдена'));
});
app.use(errors());
app.use(middlewares);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
