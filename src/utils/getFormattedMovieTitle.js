const Movie = require('../models/movie');

const getFormattedMovieTitle = async (movieId) => {
  try {
    const movie = await Movie.findById(movieId);
    const movieTitle = movie.title;
    const formattedTitle = movieTitle.replace(/[^\w\s]/gi, '').replace(/\s+/g, '-').toLowerCase();
    return formattedTitle;
  } catch (error) {
    throw new Error(`Error getting movie title: ${error}`);
  }
};

module.exports = getFormattedMovieTitle;
