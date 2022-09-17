

//Require application dependencies

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const request = require('request');

// Configure dotenv package

require('dotenv').config();

//API Key

const api = `${process.env.API_KEY}`;



//Setting up express app and body-parser configurations

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

//Set up home page on launch

app.get('/', (req, res) => {
    // It will not fetch and display any data in the index page

    res.render("index");
});

//Post request to receive data from OpenWeatherApp
app.post('/', (req, res) => {

    //Get the city name passed in the form
    let city = req.body.city

    //Use the city name to fetch data
    //Use the API_KEY in the '.env' file

    let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${api}`;
    
    //Request data using the URL
    request(url, (err, response, body) => {
        if (err) {
            res.render("index", {weather: null, error: 'Error, please try again'});
        }else {
            let weather = JSON.parse(body);
            console.log(weather);

            if (weather.main === undefined) {
                res.render('index', {weather: null, error:'Error, please try again'});

            } else {
                let place = `${weather.name}, ${weather.sys.country}`,
                weatherTimeZone = `${new Date (
                    weather.dt * 1000 - weather.timezone * 1000
                )}`;
                let weatherTemp = `{weather.main.temp}`,
                    weatherPressure = `{weather.main.pressure}`,
                    // fetching the weather icon and it's size
                    weatherIcon = `http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png}`,
                    weatherDescription = `${weather.weather[0].description}`,
                    humidity = `weather.main.humidity`,
                    clouds = `{weather.clouds.all}`,
                    visibility = `{weather.visibility}`,
                    main = `{weather.weather[0].main}`,
                    weatherFahrenheit;
                    weatherFahrenheit = (weatherTemp * 9) / 5 + 32;

                // round off the value of the degrees Farenheit into two decimal places

                let roundToTwo = (num) => {
                    return +(Math.round(num + "e+2") + "e-2");
                }
                weatherFahrenheit = roundToTwo(weatherFahrenheit);

                res.render("index", {
                    weather: weather,
                    place: place,
                    temp: weatherTemp,
                    pressure: weatherPressure,
                    icon: weatherIcon,
                    description: weatherDescription,
                    timezone: weatherTimeZone,
                    humidity: humidity,
                    fahrenheit: weatherFahrenheit,
                    clouds: clouds,
                    visibility: visibility,
                    main: main,
                    error: null,
                  });
            }
        }

    }) ;

    
});

app.listen(process.env.PORT, () => {
    console.log('Weather app listening on port 3000');
    
})

