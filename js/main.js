// DOM manipulations

function searchForecastHandler(event) {    
    event.preventDefault();    

    // Variable to hold search input
    const searchTerm = $('#searchTerm').val().trim(); 

    if (searchTerm === "") {
        console.log('show error');        
        $('#error').text('Please enter location').css( 'color', 'red' );
    }
    else {        
        getCoordinates(searchTerm);
        
        // Clear location input
        $('#searchTerm').val('');
             
        // Clear error message
        $('#error').text(''); 
    }     
};

function searchHistoryHandler(event) {
    event.preventDefault();

    const cityName = event.target.innerHTML;

    // Retrieve forecast list from the localStorage
    const forecastList = getForecastFromStorage();
    if (forecastList) {
        for (let forecast of forecastList) {
            if (forecast.city === cityName) {
                const details = forecast.forecasts;
                console.log('details',details);
                generateForecast (cityName, details) ;
            }
        }    
    }

    // Clear error message
    $('#error').text(''); 
}

function displayForecast() {

    // Remove the content of the elements
    const searchHistory = $('#search-history');
    searchHistory.empty();     
    
    // Retrieve forecast list from the localStorage
    const forecastList = getForecastFromStorage();
    if (forecastList) {
        for (let forecast of forecastList) {
            const cityBtn = $('<button>').addClass('btn btn-secondary').text(forecast.city);
            $('#search-history').addClass('border-top border-4 p-4').append(cityBtn);
        }
    }
}

$(document).ready(function () {
    
    // Call forecastHandler() when search input is submitted
    $('#search-btn').on('click', searchForecastHandler);    // Search button
    $('#search-form').on('submit', searchForecastHandler);  // Enter key
    $('#search-history').on('click', searchHistoryHandler);
    displayForecast();
    
});
