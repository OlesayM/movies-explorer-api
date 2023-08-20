const Movie = require('../models/movie');
const ErrNotFound = require('../errors/ErrNotFound');
const ErrForbidden = require('../errors/ErrForbidden');
const ErrBadRequest = require('../errors/ErrBadRequest');

// возвращает все сохранённые текущим пользователем фильмы
module.exports.getMovies = (req, res, next) => {
  const userId = req.user._id;
  Movie.find({ owner: userId })
    .then((movies) => res.send({ movies }))
    .catch((err) => {
      next(err);
    });
};

// создаёт фильм
module.exports.createMovie = (req, res, next) => {
  Movie.create(
    {
      owner: req.user._id,
      ...req.body,
    },
  )
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ErrBadRequest('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

// удаляет сохранённый фильм по id
module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        throw new ErrNotFound('Фильм не найдена');
      }
      if (String(movie.owner) !== String(req.user._id)) {
        throw new ErrForbidden('Нет прав на удаление');
      }
      // console.log(req.params.cardId);
      return Movie.findByIdAndRemove(req.params.movieId);
    })
    .then((movie) => res.status(200).send({ data: movie }))
    .catch((err) => {
      next(err);
    });
};
