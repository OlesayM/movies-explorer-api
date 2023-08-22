const router = require('express').Router();
const { userRouter } = require('./users');
const { movieRouter } = require('./movies');
const auth = require('../middlewares/auth');
const ErrNotFound = require('../errors/ErrNotFound');
const { login, createUser } = require('../controllers/users');
const { checkLogin, checkCreateUser } = require('../middlewares/validation');

router.post(
  '/signin',
  checkLogin,
  login,
);

router.post(
  '/signup',
  checkCreateUser,
  createUser,
);

router.use(auth);
router.use('/users', userRouter);
router.use('/movies', movieRouter);

router.all('*', () => {
  throw new ErrNotFound('Страница не найдена');
});

module.exports = router;
