var apiKey = "1f1b107e74f0a19a7dd0518bdd4c1ec6"; //personal key for fetching data
var citySearch = document.querySelector("#city-search"); //form for user search
var inputBox = document.querySelector("#input-box");  //text input area
var weatherDisplay = document.querySelector("#weather-display"); //area to show weather cards
var buttonList = document.querySelector("#previous"); //empty div for buttons
var previousSearch = []; //placeholder for search history
var clearButton = document.querySelector("#clear-history"); //clear history button

//on submitting the form
citySearch.addEventListener("submit",function(event){
    event.preventDefault();
    weatherDisplay.innerHTML = ""; //clear previous weather cards
    userInput = inputBox.value;
    inputBox.value = ""; //clear text input area
    getWeather(userInput);
});

//on pressing enter key
citySearch.addEventListener("keypress",function(event){
    if(event.keyCode === 13){
        event.preventDefault();
        weatherDisplay.innerHTML = ""; //clear previous weather cards
        userInput = inputBox.value;
        inputBox.value = ""; //clear text input area
        getWeather(userInput);
    }
});

//fetching weather data
function getWeather(city) {
    var todayUrl = "HTTPS://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey + "&units=metric";
    fetch(todayUrl).then(function(response) {
        if(response.ok) {
            response.json().then(function(data) {
                printToday(data); //append weather card for today
                addSearch(data.name); //add search term to search history if data fetched successfully
                storeSearch(previousSearch); //local storage
                printButton();
                
                //so that the forecast always gets fetched after the data for today
                var forecastUrl = "HTTPS://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid="+apiKey + "&units=metric";
                fetch(forecastUrl).then(function(response) {
                    if(response.ok) {
                        response.json().then(function(data) {
                            printForecast(data.list); //append weather cards for forecast
                        });
                    } 
                });
            });
        } else {
            weatherDisplay.textContent = "Invalid city";
        }
    });
};

//printing weather today
function printToday(data) {

    var todayRow = document.createElement("div");
    todayRow.setAttribute("class", "row justify-content-center mx-0");

    var cardToday = document.createElement("div");
    cardToday.setAttribute("class","col card bg-secondary my-2 mx-3 py-2");
    
    //weather icon
    var weatherIcon = document.createElement("img");
    weatherIcon.setAttribute("src","HTTPS://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png");
    weatherIcon.setAttribute("alt",data.weather[0].description);
    weatherIcon.setAttribute("style","height:80px;width:80px");

    //title
    var cardTitle = document.createElement("h3");
    cardTitle.setAttribute("class","card-title px-2 ml-3 text-light font-weight-bold");
    cardTitle.textContent = data.name + " " + moment().format("L");

    //style for all upcoming text
    var cardStyle = "card-text text-light px-2 py-1 ml-3 mb-2";

    //temperature
    var temperature = document.createElement("h4");
    temperature.setAttribute("class",cardStyle);
    temperature.textContent = "Temperature: " + data.main.temp_min + " ~ " + data.main.temp_max + " °C, feels like " + data.main.feels_like + " °C";

    //humidity
    var humidity = document.createElement("h4");
    humidity.setAttribute("class",cardStyle);
    humidity.textContent = "Humidity: " + data.main.humidity + "%";

    //wind speed
    var windSpeed = document.createElement("h4");
    windSpeed.setAttribute("class",cardStyle);
    windSpeed.textContent = "Wind speed: " + data.wind.speed + " m/s " + windDirection(data.wind.deg);

    //fetch data on UV index
    var uvUrl = "HTTPS://api.openweathermap.org/data/2.5/uvi?lat=" + data.coord.lat + "&lon=" + data.coord.lon + "&appid=" + apiKey;

    var uvIndex = document.createElement("h4");
    uvIndex.setAttribute("class",cardStyle);
    uvNum = document.createElement("span");

    fetch(uvUrl).then(function(response) {
        if(response.ok) {
            response.json().then(function(data) {
                //assign a different class depending on UV index value to have a specified BG color
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

    todayRow.appendChild(cardToday)
    weatherDisplay.appendChild(todayRow);

};

//printing 5-day forecast
function printForecast(data){
    fiveDay = document.createElement("h3");
    fiveDay.textContent = "Forecast for the next 5 days";
    fiveDay.setAttribute("class","text-dark font-weight-bold mt-2 px-3");
    weatherDisplay.appendChild(fiveDay);

    var forecastRow = document.createElement("div");
    forecastRow.setAttribute("class", "row justify-content-center mx-0");

    //five cards
    for (var i=7;i<40;i=i+7) {
        var forecastColumn = document.createElement("div");
        forecastColumn.setAttribute("class","col-12 col-xl mx-0 px-0");

        var forecastCard = document.createElement("div");
        forecastCard.setAttribute("class","card bg-secondary py-1 forecast-card my-3");

        var forecastTitle = document.createElement("h4");
        forecastTitle.setAttribute("class","card-title text-light font-weight-bold mt-2 mb-0 ml-3");
        forecastTitle.textContent = moment().add((i+1)/7,"day").format("L");

        var weatherIcon = document.createElement("img");
        weatherIcon.setAttribute("src","HTTPS://openweathermap.org/img/wn/" + data[i].weather[0].icon + ".png");
        weatherIcon.setAttribute("alt",data[i].weather[0].description);
        weatherIcon.setAttribute("style","height:60px;width:60px");
        weatherIcon.setAttribute("class","ml-3");

        var cardStyle = "card-text text-light py-1 my-1 ml-3";

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

        forecastColumn.appendChild(forecastCard);
        forecastRow.appendChild(forecastColumn);
    };

    weatherDisplay.appendChild(forecastRow);
};

//function to check for wind direction
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

//local storage
function storeSearch(input) {
    localStorage.setItem("weather locations", JSON.stringify(input));
};

//print buttong according to search history
function printButton() {
    buttonList.innerHTML = "";
    for (var i=0;i<previousSearch.length;i++) {
        button = document.createElement("button");
        button.setAttribute("type","button");
        button.setAttribute("class","btn btn-dark my-1");
        button.textContent = capitalize(previousSearch[i]); //capitalize for good formatting

        buttonList.appendChild(button);
    };
};

//capitalize first letter
function capitalize(str) {
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

//when clicking on buttons for search history
buttonList.addEventListener("click",function(event) {
    element = event.target;
    
    if (element.matches(".btn")) {
        weatherDisplay.innerHTML = "";
        userInput = element.textContent;
        getWeather(userInput);
    };
});

//button to clear history
clearButton.addEventListener("click",function() {
    previousSearch = [];
    localStorage.clear();
    printButton();
});

//conditions to add search term to search history
function addSearch(cityName) {
    if (previousSearch.length) { //if the previous search isn't empty
        if (!previousSearch.includes(cityName)) { //if search term isn't already recorded
            previousSearch.push(cityName);
        }
    } else {
        previousSearch.push(cityName);
    };
    
};

//initialize when page reloads
function init() {
    var storedSearch = JSON.parse(localStorage.getItem("weather locations")); //retrieve from local storage
    if (storedSearch !== null) { //if there's data stored
      previousSearch = storedSearch; //update search history and generate buttons
      printButton();
    }
};

init();