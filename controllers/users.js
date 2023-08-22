const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { NODE_ENV, JWT_SECRET } = require('../utils/config');
const User = require('../models/user');
const ErrBadRequest = require('../errors/ErrBadRequest'); // 400
const ErrConflict = require('../errors/ErrConflict'); // 409
const ErrNotFound = require('../errors/ErrNotFound'); // 404

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch((err) => next(err));
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      throw new ErrNotFound('Пользователь не найден');
    })
    .then((user) => res.status(200).send({ user }))
    .catch((err) => {
      next(err);
    });
};

module.exports.updateProfile = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
    .orFail(() => {
      throw new ErrNotFound('Пользователь не найден');
    })
    .then((user) => res.status(200).send({ user }))
    .catch((err) => {
      if (err.code === 11000) {
        return next(new ErrConflict('Пользователь с таким email уже зарегистрирован'));
      }
      if (err.name === 'ValidationError') {
        return next(new ErrBadRequest('Некорректные данные'));
      }
      return next(err);
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new ErrConflict(`Пользователь с ${email} уже зарегистрирован`);
      }
      return bcrypt.hash(password, 10);
    })
    .then((hash) => User.create({
      name, email, password: hash,
    }))
    .then((user) => User.findOne({ _id: user._id }))
    .then((user) => res.send({ user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ErrBadRequest('Некорректные данные'));
      } else {
        next(err);
      }
    });
};
