const {
  DATA_MOVIES = 'mongodb://127.0.0.1:27017/bitfilmsdb',
  PORT = 4000,
  JWT_SECRET,
  NODE_ENV,
} = process.env;

module.exports = {
  DATA_MOVIES,
  PORT,
  JWT_SECRET,
  NODE_ENV,
};
