const router = require('express').Router();
const validation = require('../middlewares/validation');
const auth = require('../middlewares/auth');
const {
  updateProfile, getCurrentUser,
} = require('../controllers/users');

router.use(auth);
router.get('/me', getCurrentUser);
router.patch('/me', validation.checkProfile, updateProfile);

module.exports.userRouter = router;
