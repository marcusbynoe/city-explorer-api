'use strict';

console.log('hello is this working?');


//** REQUIRES **
const express = require('express');
require('dotenv').config();
const cors = require('cors');
const axios = require('axios');
// const { response } = require('express');
// const { request, response } = require('express');


// **** DON'T FORGET TO REQUIRE YOUR START JSON FILE ****
// let data = require('./data/weather.json');


// ******* Once express is in we need to use it - per express docs
// **** app === server
const app = express();


//**** MIDDLEWARE ****
//**** cors is midelware - security guard that allows us to share resources across the internet ******
app.use(cors());

//*** DEFINE A PORT FOR MY SERVER TO RUN ON ****
const PORT = process.env.PORT || 3002;


//****** ENDPOINTS ******
//******* Base endpoint - proof of life *****
//**** 1st arg - endpoint in quotes ****
//*** 2nd arg - callback which will execute when someone hits that point ***
// **** Callback function - 2 parameters: request, response (req,res) ***

app.get('/', (request, response) => {
  response.status(200).send('I am watching you');
});



// app.get('/hello', (request, response) => {
//   console.log(request.query);

//   let firstName = request.query.firstName;
//   let lastName = request.query.lastName;

//   response.status(200).send(`Hello ${firstName} ${lastName}! Welcome to my server`);
// });


app.get('/weather', async (request, response, next) => {
  try {
    // let searchQuery = request.query.searchQuery;
    let lat = request.query.lat;
    let lon = request.query.lon;

    let url = `https://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHER_API_KEY}&lat=${lat}&lon=${lon}&days=4&units=I`;

    let weatherResults = await axios.get(url);

    let weatherArr = weatherResults.data.data;
    // let city = data.find(city => city.city_name.toLowerCase() === cityName.toLowerCase());

    let weatherData = weatherArr.map(weatherObj => new Forecast(weatherObj));

    response.status(200).send(weatherData);


  } catch (error) {
    next(error);
  }

});

app.get('/movies', async (request, response, next) => {
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



});






//****** CLASS TO GROOM BULKY DATA ****

class Forecast {
  constructor(weatherObj) {
    this.date = weatherObj.valid_date;
    this.description = weatherObj.weather.description;
  }
}

class Movie {
  constructor(movieObj) {
    this.title = movieObj.title;
    this.description = movieObj.overview;
    this.image = 'https://image.tmdb.org/t/p/w500'+ movieObj.poster_path;
  }
}

// ***** CATCH ALL ENDPOINT - NEEDS TO BE YOUR LAST DEFINED ENDPOINT ****
app.get('*', (request, response) => {
  response.status(404).send('This page does not exist');
});



// **** ERROR HANDLING - PLUG AND PLAY CODE FROM EXPRESS DOCS *****
app.use((error, request, response, next) => {
  response.status(500).send(error.message);
});


//***** SERVER START ******
app.listen(PORT, () => console.log(`We are running on port: ${PORT}`));
