const router = require('express').Router();
const validation = require('../middlewares/validation');
const {
  getMovies, createMovie, deleteMovie,
} = require('../controllers/movies');

router.get('/', getMovies);
router.post('/', validation.checkCreateMovie, createMovie);
router.delete('/:movieId', validation.checkMovieId, deleteMovie);

module.exports = router;
