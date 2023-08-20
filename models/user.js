const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const ErrUnauthorized = require('../errors/ErrUnauthorized');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: [2, 'минимальная длина поля "name" - 2'],
      maxlength: [30, 'минимальная длина поля "name" - 30'],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (v) => validator.isEmail(v),
        message: 'Некорректный адрес почты',
      },
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
  },
  { versionKey: false },
);
// eslint-disable-next-line func-names
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new ErrUnauthorized('Неправильные почта или пароль'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new ErrUnauthorized('Неправильные почта или пароль'));
          }

          return user;
        });
    });
};
module.exports = mongoose.model('user', userSchema);
