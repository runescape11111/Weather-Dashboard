var apiKey = "1f1b107e74f0a19a7dd0518bdd4c1ec6";
var citySearch = document.querySelector("#city-search");
var inputBox = document.querySelector("#input-box");
var weatherDisplay = document.querySelector("#weather-display");
var previousSearch = [];

citySearch.addEventListener("submit",function(event){
    event.preventDefault();
    weatherDisplay.innerHTML = "";
    userInput = inputBox.value;
    getWeather(userInput);
    //add search to array IF not already in there
});

function getWeather(city) {
    var todayUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey + "&units=metric";
    fetch(todayUrl).then(function(response) {
        if(response.ok) {
            response.json().then(function(data) {
                console.log(data);
                printToday(data);
            });
        } else {
            weatherDisplay.textContent = "Invalid city";
        }
    });
    
    var forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid="+apiKey + "&units=metric";
    fetch(forecastUrl).then(function(response) {
        if(response.ok) {
            response.json().then(function(data) {
                console.log(data);
                printForecast(data.list);
            });
        } 
    });
};

function printToday(data) {
    var cardToday = document.createElement("div");
    cardToday.setAttribute("class","card bg-secondary my-2 py-2");
    
    var weatherIcon = document.createElement("img");
    weatherIcon.setAttribute("src","http://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png");
    weatherIcon.setAttribute("alt",data.weather[0].description);
    weatherIcon.setAttribute("style","height:80px;width:80px");

    var cardTitle = document.createElement("h3");
    cardTitle.setAttribute("class","card-title px-2 ml-3 text-light font-weight-bold");
    cardTitle.textContent = data.name + " " + moment().format("L");

    var cardStyle = "card-text text-light px-2 py-1 ml-3 mb-2";

    var temperature = document.createElement("h4");
    temperature.setAttribute("class",cardStyle);
    temperature.textContent = "Temperature: " + data.main.temp_min + " ~ " + data.main.temp_max + " °C, feels like " + data.main.feels_like + " °C";

    var humidity = document.createElement("h4");
    humidity.setAttribute("class",cardStyle);
    humidity.textContent = "Humidity: " + data.main.humidity + "%";

    var windSpeed = document.createElement("h4");
    windSpeed.setAttribute("class",cardStyle);
    windSpeed.textContent = "Wind speed: " + data.wind.speed + " m/s " + windDirection(data.wind.deg);

    var uvUrl = "https://api.openweathermap.org/data/2.5/uvi?lat=" + data.coord.lat + "&lon=" + data.coord.lon + "&appid=" + apiKey;

    var uvIndex = document.createElement("h4");
    uvIndex.setAttribute("class",cardStyle);
    uvNum = document.createElement("span");

    fetch(uvUrl).then(function(response) {
        if(response.ok) {
            response.json().then(function(data) {
                if (data.value<2) {
                    uvNum.setAttribute("class","uvlow");
                } else if (data.value<5) {
                    uvNum.setAttribute("class","uvmed");
                } else if (data.value<7) {
                    uvNum.setAttribute("class","uvhigh");
                } else if (data.value<10) {
                    uvNum.setAttribute("class","uvveryhigh");
                } else {
                    uvNum.setAttribute("class","uvtoohigh");
                }
                uvNum.textContent = data.value;
            });
        } else {
            uvNum.textContent = "Cannot fetch data!";
        }
    });

    uvIndex.textContent = "UV Index: ";
    uvIndex.appendChild(uvNum);
    cardTitle.appendChild(weatherIcon);

    cardToday.appendChild(cardTitle);
    cardToday.appendChild(temperature);
    cardToday.appendChild(humidity);
    cardToday.appendChild(windSpeed);
    cardToday.appendChild(uvIndex);

    weatherDisplay.appendChild(cardToday);

};

function printForecast(data){
    fiveDay = document.createElement("h3");
    fiveDay.textContent = "Forecast for the next 5 days";
    fiveDay.setAttribute("class","text-dark font-weight-bold mt-1");
    weatherDisplay.appendChild(fiveDay);

    var forecastRow = document.createElement("div");
    forecastRow.setAttribute("class", "row justify-content-between");

    for (i=7;i<40;i=i+7) {
        var forecastCard = document.createElement("div");
        forecastCard.setAttribute("class","col card bg-secondary my-2 py-1 forecast-card");

        var forecastTitle = document.createElement("h4");
        forecastTitle.setAttribute("class","card-title text-light font-weight-bold mt-2 mb-0");
        forecastTitle.textContent = moment().add((i+1)/7,"day").format("L");

        var weatherIcon = document.createElement("img");
        weatherIcon.setAttribute("src","http://openweathermap.org/img/wn/" + data[i].weather[0].icon + ".png");
        weatherIcon.setAttribute("alt",data[i].weather[0].description);
        weatherIcon.setAttribute("style","height:60px;width:60px");

        var cardStyle = "card-text text-light py-1 my-1";

        var temperature = document.createElement("h6");
        temperature.setAttribute("class",cardStyle);
        temperature.setAttribute("style","white-space: pre;");
        temperature.textContent = "Temp: " + data[i].main.temp + " °C\r\nFeels like " + data[i].main.feels_like + " °C";

        var humidity = document.createElement("h6");
        humidity.setAttribute("class",cardStyle);
        humidity.textContent = "Humidity: " + data[i].main.humidity + "%";

        var windSpeed = document.createElement("h6");
        windSpeed.setAttribute("class",cardStyle);
        windSpeed.textContent = "Wind: " + data[i].wind.speed + " m/s " + windDirection(data[i].wind.deg);

        forecastCard.appendChild(forecastTitle);
        forecastCard.appendChild(weatherIcon);
        forecastCard.appendChild(temperature);
        forecastCard.appendChild(humidity);
        forecastCard.appendChild(windSpeed);

        forecastRow.appendChild(forecastCard);
    };

    weatherDisplay.appendChild(forecastRow);
};

function windDirection(deg) {
    var direction;
    if ((deg>=23) && (deg<=67)) {
        direction = "NE";
    } else if ((deg>=68) && (deg<=112)) {
        direction = "E";
    } else if ((deg>=113) && (deg<=157)) {
        direction = "SE";
    } else if ((deg>=158) && (deg<=202)) {
        direction = "S";
    } else if ((deg>=203) && (deg<=247)) {
        direction = "SW";
    } else if ((deg>=248) && (deg<=292)) {
        direction = "W";
    } else if ((deg>=293) && (deg<=337)) {
        direction = "NW";
    } else {
        direction = "N";
    };
    return direction;
};