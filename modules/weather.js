'use strict';

const axios = require('axios');

async function getWeather(request, response, next) {
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

  class Forecast {
    constructor(weatherObj) {
      this.date = weatherObj.valid_date;
      this.description = weatherObj.weather.description;
    }
  }

}

module.exports = getWeather;
