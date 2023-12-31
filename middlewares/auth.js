const jwt = require('jsonwebtoken');
const { NODE_ENV, JWT_SECRET } = require('../utils/config');
const ErrUnauthorized = require('../errors/ErrUnauthorized');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new ErrUnauthorized('Необходимо авторизироваться'));
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    return next(new ErrUnauthorized('Необходимо авторизироваться'));
  }
  req.user = payload;
  return next();
};
