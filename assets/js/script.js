

var translateCity = function(city) {
    var apiUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + ",US&appid=f0ae06afe6fabb93ea6866f6b722fa6a"

    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                console.log(data);
                var lat = data[0].lat;
                var lon = data[0].lon;

                getWeather(city, lat, lon);
            })
        } else {
            console.log("Unable to locate city");
        }
    })
    .catch(function(error) {
        alert("Unable to connect to OpenWeather Geocoding");
    });
};

var getWeather = function(city, lat, lon) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude={part}&appid=f0ae06afe6fabb93ea6866f6b722fa6a"

    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                console.log(data);
            });
        } else {
            console.log("Unable to retrieve weather data");
        }
    })
    .catch(function(error) {
        alert("Unable to connect to OpenWeather OneCall");
    });
};

translateCity("Washington DC");