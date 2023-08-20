const router = require('express').Router();
const validation = require('../middlewares/validation');
const {
  updateProfile, getCurrentUser,
} = require('../controllers/users');

router.get('/me', getCurrentUser);
router.patch('/me', validation.checkProfile, updateProfile);

module.exports = router;
