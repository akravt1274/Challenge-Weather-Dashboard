// js to interact with the Weather Forecast API
const APIKey = "c78bb62e8ceaacd683a79d19cf7d637a"; // API Key

 // Get coordinates (lat, lon) for a city
function getCoordinates(searchTerm) {
    const directURL = `https://api.openweathermap.org/geo/1.0/direct?q=${searchTerm}&appid=${APIKey}`;
    fetch(directURL)
        .then((response) => {            
            if (!response.ok) {
                console.log('Response status:', response.status);
            }
            response.json().then((coord) => {
                getForecast(coord, searchTerm);
            })                    
        })
        .catch((error) => {
                console.log(error);
        });
}

// Get 5 day forecast data for a city
function getForecast(coord, searchTerm) {

    let lat = coord[0].lat;
    let lon = coord[0].lon;
    // console.log('lat and lon', lat, lon);
    
    const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIKey}&units=metric`;
    fetch(forecastURL)
        .then((response) => {
            if (!response.ok) {
                console.log('Response status:', response.status);
            }
            response.json().then((data) => {
                console.log('Response data', data);
                forecastDetails(data);
            })                    
        })
        .catch((error) => {
            console.log(error);
        })
}

function forecastDetails(data) {
                        
    let city = data.city.name;  
                    
    let arrforecasts = [];

    for (let i = 0; i < data.list.length; i++) {
                                
        let date = data.list[i].dt_txt.substring(0, 10);
        let icon = data.list[i].weather[0].icon;
        let description = data.list[i].weather[0].description;
        let temp = data.list[i].main.temp;
        let wind = data.list[i].wind.speed;
        let humidity = data.list[i].main.humidity;

        const forecast = {
            date: dayjs(date).format('MMM D, YYYY'), // use Day.js to format the date
            icon: icon,
            description: description,
            temp: Math.round(temp), // use Math.round() to round temp value
            wind: wind,
            humidity: humidity
        };

        arrforecasts.push(forecast);
        i = i + 7; // to exclude 3 hour forecast data 
    }

    // Store forecast data in cityForecast object
    const weather = {
        city: city,
        forecasts: arrforecasts
    };

    // Retrieve forecasts from the localStorage, parse the JSON to an array and push the new forecast to the array
    const forecasts = getForecastFromStorage();
    forecasts.push(weather);

    // Save the array with newly added forecast to the local storage
    saveForecastToStorage(forecasts);

    //const forecast = weather.forecasts;
    generateForecast(city, arrforecasts);

    displayForecast();
}

function generateForecast(city, forecast) {

    // Remove the content for below elements
    const currentWeatherDiv = $('#current-weather');
    currentWeatherDiv.empty();
    const futureWeatherDiv = $('#future-weather');
    futureWeatherDiv.empty();
    
    // Output current weather conditions for the city on the top of the page
    const cityName = $('<h3>').addClass('d-inline p-2 mb-0 fw-bold').text(city);
    $('#current-weather').append(cityName);
    const currentDate = $('<h3>').addClass('d-inline p-2 mb-0 fw-bold').text(`(${forecast[0].date})`);
    const imgIcon = $('<img>').attr({'src':`http://openweathermap.org/img/w/${forecast[0].icon}.png`, 'alt':'weather-icon'});            
    const temp = $('<p>').addClass('px-4 p-2 mb-0').text(`Temp: ${forecast[0].temp} °C`);
    const wind = $('<p>').addClass('px-4 p-2 mb-0').text(`Wind: ${forecast[0].wind} MPH`);
    const humidity = $('<p>').addClass('px-4 p-2 mb-0').text(`Humidity: ${forecast[0].humidity} %`);            
    const spanIcon = $('<span>').addClass('mx-auto');
    spanIcon.append(imgIcon);
    $('#current-weather').addClass('p-2 border border-4').append(currentDate, spanIcon, temp, wind, humidity); 
    
    // Output 5-day weather conditions for the city at the bottom of the page
    for (let i = 0; i < forecast.length; i++) {
        
        const date = $('<h5>').addClass('p-2 mb-0 fw-bold').text(forecast[i].date);            
        const imgIcon = $('<img>').attr({'src':`http://openweathermap.org/img/w/${forecast[i].icon}.png`, 'alt':'weather-icon'});            
        const temp = $('<p>').addClass('p-2 mb-0').text(`Temp: ${forecast[i].temp} °C`);
        const wind = $('<p>').addClass('p-2 mb-0').text(`Wind: ${forecast[i].wind} MPH`);
        const humidity = $('<p>').addClass('p-2 mb-0').text(`Humidity: ${forecast[i].humidity} %`);
        const divIcon = $('<div>').addClass('mx-auto');
        divIcon.append(imgIcon);
        const div = $('<div>').addClass('details p-2 rounded-3');
        div.append(date, divIcon, temp, wind, humidity);
        $('#future-weather').append(div);   
    }    
}

// Retrieve forecasts from the localStorage
function getForecastFromStorage() {    
    let forecasts = JSON.parse(localStorage.getItem('forecasts'));
    
    // If there are no forecasts in localStorage, initialize an empty array ([]) and return it
    if (!forecasts) {
        forecasts = [];
        console.log('No forecasts found in local storage');  
    }   
    return forecasts;
}

// Accept an array of forecasts, stringify them, and save into localStorage
function saveForecastToStorage(forecasts) {
    localStorage.setItem('forecasts', JSON.stringify(forecasts));
}




