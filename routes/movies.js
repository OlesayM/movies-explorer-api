const router = require('express').Router();
const validation = require('../middlewares/validation');
const auth = require('../middlewares/auth');
const {
  getMovies, createMovie, deleteMovie,
} = require('../controllers/movies');

router.use(auth);
router.get('/', getMovies);
router.post('/', validation.checkCreateMovie, createMovie);
router.delete('/:movieId', validation.checkMovieId, deleteMovie);

module.exports.movieRouter = router;
