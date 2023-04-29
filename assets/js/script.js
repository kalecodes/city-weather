var searchHistory = [];

var searchBtnEl = document.querySelector("#search-btn");
var citySearchEl = document.querySelector("#city-search");
var searchHistoryEl = document.querySelector("#history");

var currentWeatherEl = document.querySelector("#today");
var forecastEl = document.querySelector("#forecast");

var translateCity = function(city) {
    var apiUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + ",US&appid=f0ae06afe6fabb93ea6866f6b722fa6a"

    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                var lat = data[0].lat;
                var lon = data[0].lon;
                var cityName = data[0].name;

                getWeather(cityName, lat, lon);
            })
        } else {
            console.log("Unable to locate city");
        }
    })
    .catch(function(error) {
        alert("Unable to connect to OpenWeather Geocoding");
    });
};

var getWeather = function(cityName, lat, lon) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly,alerts&units=imperial&appid=f0ae06afe6fabb93ea6866f6b722fa6a"

    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {

                displayWeather(cityName, data);
            });
        } else {
            console.log("Unable to retrieve weather data");
        }
    })
    .catch(function(error) {
        alert("Unable to connect to OpenWeather OneCall");
    });
};

var displayWeather = function(cityName, data) {
    displayToday(cityName, data);
    displayForecast(data);
}

var displayToday = function(cityName, data) {
    // clear previous data
    currentWeatherEl.textContent = ""

    // get todays date
    var date = moment().format("dddd MMM Do, YYYY");
    var dateEl = document.createElement("h5");
    dateEl.textContent = date;

    // display city name, date, and icon
    var headerSpan = document.createElement("span");
    headerSpan.className = "d-inline-flex align-items-center py-1";
    var cityNameEl = document.createElement("h1");
    var iconEl = document.createElement("img");
    iconEl.setAttribute("src", "http://openweathermap.org/img/wn/" + data.current.weather[0].icon + "@2x.png")
    cityNameEl.textContent = cityName + " ";

    headerSpan.appendChild(cityNameEl);
    headerSpan.appendChild(iconEl);

    // create and style stat elements
    var tempEl = document.createElement("p");
    tempEl.textContent = "Temp: " + data.current.temp + " °F";
    var windEl = document.createElement("p");
    windEl.textContent = "Wind: " + data.current.wind_speed + " MPH";
    var humidityEl = document.createElement("p");
    humidityEl.textContent = "Humidity: " + data.current.humidity + "%";
    var uviEl = document.createElement("span");
    uviEl.textContent = "UV Index: " + data.current.uvi;

    // append to container
    currentWeatherEl.appendChild(dateEl);
    currentWeatherEl.appendChild(headerSpan);
    currentWeatherEl.appendChild(tempEl);
    currentWeatherEl.appendChild(windEl);
    currentWeatherEl.appendChild(humidityEl);
    currentWeatherEl.appendChild(uviEl);
};

var displayForecast = function(data) {
    // clear previous forecast
    forecastEl.textContent = "";

    var forecastHeaderEl = document.createElement("h3");
    forecastHeaderEl.className = "p-2";
    forecastHeaderEl.textContent = "5-Day Forecast:";

    var cardHolderEl = document.createElement("div");
    cardHolderEl.className = "d-inline-flex justify-content-between pb-4";

    // create cards for each day
    for (var i = 0; i < 5; i++) {
        var cardEl = document.createElement("div");
        cardEl.className = "card p-2";

        var date = moment().add(i + 1, 'days').format("MMM Do, YY");
        var cardHeaderEl = document.createElement("h5");
        cardHeaderEl.textContent = date;

        var cardIconEl = document.createElement("img");
        cardIconEl.setAttribute("src", "https://openweathermap.org/img/wn/" + data.daily[i].weather[0].icon + "@2x.png");

        var cardTempEl = document.createElement("p");
        cardTempEl.textContent = data.daily[i].temp.day + " °F";

        var cardWindEl = document.createElement("p");
        cardWindEl.textContent = data.daily[i].wind_speed + " MPH";

        var cardHumidityEl = document.createElement("p");
        cardHumidityEl.textContent = data.daily[i].humidity + "%";

        cardEl.appendChild(cardHeaderEl);
        cardEl.appendChild(cardIconEl);
        cardEl.appendChild(cardTempEl);
        cardEl.appendChild(cardWindEl);
        cardEl.appendChild(cardHumidityEl);
        cardHolderEl.appendChild(cardEl);
    }

    forecastEl.appendChild(forecastHeaderEl);
    forecastEl.appendChild(cardHolderEl);
};

searchBtnEl.addEventListener("click", function() {
    var city = citySearchEl.value.trim();
    citySearchEl.value = "";
    translateCity(city);
    saveSearch(city);
});

var saveSearch = function(city) {
    searchHistory.unshift(city);

    localStorage.setItem("searched cities", JSON.stringify(searchHistory));

    loadSearchHistory();
}

var loadSearchHistory = function() {
    searchHistory = JSON.parse(localStorage.getItem("searched cities"));

    if (!searchHistory) {
        searchHistory = [];
    }

    // clear previous
    searchHistoryEl.textContent = "";

    for (var i = 0; i < searchHistory.length && i < 7; i++) {
        var historyEl = document.createElement("button");
        historyEl.textContent = searchHistory[i];
        historyEl.className = "btn btn-secondary btn-lg my-1 d-block";

        searchHistoryEl.appendChild(historyEl);
    }
}

loadSearchHistory();