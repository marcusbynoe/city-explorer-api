'use strict';

const axios = ('axios');

async function getMovies(request, response, next) {
  try {
    let searchQuery = request.query.searchQuery;
    let url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=${searchQuery}&language=en-US&page=1&include_adult=false`;

    let moviesFromAxios = await axios.get(url);

    let moviesArr = moviesFromAxios.data.results;
    let newMovieArr = moviesArr.map(movie => new Movie(movie));


    response.status(200).send(newMovieArr);

  } catch (error) {
    next(error);
  }

  class Movie {
    constructor(movieObj) {
      this.title = movieObj.title;
      this.description = movieObj.overview;
      this.image = 'https://image.tmdb.org/t/p/w500' + movieObj.poster_path;
    }
  }
}


module.exports = getMovies;
