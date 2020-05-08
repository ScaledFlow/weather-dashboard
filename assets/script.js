// Set global variables.
var cities = [];
var citiesStored = [];
var $citiesList = $("<ul>");
var searchCount = 0;
var itemCount = 0;
var blankCity = "";
var mainCloudValue = "";
var weatherIcon = "";
var latValue = 0;
var lonValue = 0;
var uniValue = 0;

// Call initialization function.
init();

// Function retrieves cities store in local storage and
// populates the sidebar with cities search in the past and
// also populates the main dashboard and five-day forecast with
// data from the last city searched when a new browser session is started.
function init() {
  var citiesExist = localStorage.getItem("cities");
  console.log("cities exist = " + citiesExist);
  if (citiesExist != null) {
    getLocalStore();
    owAPICall(cities[0]);
    for (i = cities.length; i > 0; i--) {
      buildCitiesSearch(cities[i - 1]);
    }
  }
}
// https://www.youtube.com/watch?v=unk-U_LQWuA
// Search button click event.
$(document).ready(function () {
  $("#search-btn").on("click", function () {
    var searchCity = $(".city-input").val().trim();
    $(".city-input").val("");
    if (searchCity != "") {
      //init();
      unshiftCity(searchCity);
      setLocalStore();
      //getLocalStore();
      buildCitiesSearch(searchCity);
      owAPICall(searchCity);
    }
  });
});

// Function calls OpenWeather API to get weather info for a given city.
// Function also populates the main weather dashboard.
function owAPICall(city) {
  var queryURL = buildAPIString(city);
  // $.ajax({
  //   url: queryURL,
  //   method: "GET",
  // })
  //   .then((response) => response.json())
  //   .then((data) => console.log(data))
  //   .catch((err) => alert("wrong city name"));

  fetch(queryURL)
    .then((response) => response.json())
    .then((data) => {
      var nameValue = data["name"];
      var tempValue = data["main"]["temp"];
      var cloudValue = data["weather"][0]["main"];
      mainCloudValue = cloudValue;
      var descValue = data["weather"][0]["description"];
      var humValue = data["main"]["humidity"];
      var windValue = data["wind"]["speed"];
      latValue = data["coord"]["lat"];
      lonValue = data["coord"]["lon"];
      owUVAPICall(latValue, lonValue);
      getWeatherIcon(cloudValue);
      $("#main-card-city")
        .empty()
        .append(city + " " + "(" + buildDate() + ")" + " " + weatherIcon);
      $("#main-card-temp")
        .empty()
        .append("Temperature: " + tempValue + "<span> &#8457</span>");
      $("#main-card-hum")
        .empty()
        .append("Humidity: " + humValue + "<span>&#37</span>");
      $("#main-card-wind")
        .empty()
        .append("Wind Speed: " + windValue + "<span> MPH</span>");
    })

    .catch((err) => alert("wrong city name"));
}

// Past cities search click event.

// Note - this method does not support dynamic links
// $(document).ready(function () {
//   $(".search-cities-list").on("click", function () {
//     var clickedCity = $(this).text();
//     console.log("clicked city = " + clickedCity);

// fix made to support dynamic links
$("body").on("click", ".search-cities-list", function () {
  var clickedCity = $(this).text();
  console.log("clicked city fix = " + clickedCity);

  //buildCitiesSearch(clickedCity);
  owAPICall(clickedCity);
  buildFiveDayString(clickedCity);
});
// });

// Function Populates the city sidebar with past searches when the application launches.
function buildCitiesSearch(city) {
  if (searchCount === 0 && cities.length != 0) {
    $citiesList.addClass("list-group");
    $("#city-list-section").append($citiesList);
    searchCount++;
  }

  itemCount++;
  var $cityListItem = $("<li class='search-cities-list'></li>");
  $cityListItem.addClass("list-group-item");
  $cityListItem.addClass("list-group-city-" + itemCount);
  $cityListItem.text(city);
  $(".list-group").prepend($cityListItem);

  // Populate the 5-Day Forecast section.
  buildFiveDayString(city);
}

// Function evaluates the weather description and assigns a font awesome weather icon.
function getWeatherIcon(weatherMain) {
  switch (weatherMain) {
    case "Rain":
      weatherIcon = '<i class="fas fa-cloud-showers-heavy"></i>';
      break;
    case "Clouds":
      weatherIcon = '<i class="fas fa-cloud"></i>';
      break;
    case "Clear":
      weatherIcon = '<i class="fas fa-sun"></i>';
      break;

    default:
      console.log("getWeatherIcon function failed");
  }
}

// Function calls OpenWeather API with longitude and latitude
// coordinates to retrieve UV Index data.
function owUVAPICall(lat, lon) {
  var uvQueryURL = buildUVAPIString(latValue, lonValue);
  fetch(uvQueryURL)
    .then((response) => response.json())
    .then((data) => {
      var nameValue = data["current"];
      uviValue = data["current"]["uvi"];
      $("#main-card-uv-index").attr({ class: assingUviColor() });
      $("#main-card-uv-index").empty().append(uviValue);
    });
}

// Function unshifts city to array.
function unshiftCity(city) {
  cities.unshift(city);
}

// Function assigns a display color to UV Index on the main dashboard.
function assingUviColor() {
  var n = "";
  if (uviValue < 3) {
    n = "uv-index-low";
  } else {
    if (uviValue > 2 && uviValue < 6) {
      n = "uv-index-moderate";
    } else {
      if (uviValue > 5 && uviValue < 8) {
        n = "uv-index-high";
      } else {
        n = "uv-index-very-high";
      }
    }
  }
  return n;
}

// Function build the OpenWeather API string for a 5-Day forecast and
// also populates the 5-day forecast section
function buildFiveDayString(cityTest) {
  var owAPIBase = "https://api.openweathermap.org/data/2.5/forecast?q=";
  var owCity = cityTest;
  var owAppId = "&appid=";
  var owKey = "5d00d98dfc178da12841d9b47f1fcc8f";
  var combinedforecastAPI = owAPIBase + owCity + owAppId + owKey;
  var queryURL = combinedforecastAPI;
  fetch(queryURL)
    .then((response) => response.json())
    .then((data) => {
      // Increment values in the API array (6, 14, 22, 30, 38)
      var dayIncr = 6;
      var tempValueDay;
      var humidityValueDay;
      var skyValueDay;

      for (i = 0; i < 5; i++) {
        // Populate five-day forecast date
        $("#five-day-date-" + (i + 1))
          .empty()
          .append(buildDateIncrement(i + 1));

        // Populate five-day forecast temp
        tempValueDay = data["list"][dayIncr]["main"]["temp"];
        $("#five-day-temp-" + (i + 1))
          .empty()
          .append(
            "Temp: " + kelvinToFahr(tempValueDay) + "<span> &#8457</span>"
          );

        // Populate five-day forecast hunidity
        humidityValueDay = data["list"][dayIncr]["main"]["humidity"];
        $("#five-day-humidity-" + (i + 1))
          .empty()
          .append("Humidity: " + humidityValueDay + "<span>&#37</span>");

        // Populate five-day forecast cloud cover
        skyValueDay = data["list"][dayIncr]["weather"][0]["main"];
        getWeatherIcon(skyValueDay);
        $("#five-day-sky-" + (i + 1))
          .empty()
          .append(weatherIcon);

        // Increment through the API where 8 added to the counter equals a 24 hour.
        dayIncr = dayIncr + 8;
      }
    });
}

// Function converst Kelvin to fahrenheit
function kelvinToFahr(temp) {
  var n = ((temp - 273.15) * 9) / 5 + 32;
  n = Math.floor(n);
  return n;
}

// Function builds the OpenWeather API request string to UV index.
function buildUVAPIString(lat, lon) {
  var owAPIBase = "https://api.openweathermap.org/data/2.5/onecall?";
  var latPre = "lat=";
  var lotPre = "&lon=";
  var exclude = "&exclude=hourly,daily";
  var appID = "&appid=";
  var owKey = "5d00d98dfc178da12841d9b47f1fcc8f";
  var combinedUVAPI =
    owAPIBase + latPre + lat + lotPre + lon + exclude + appID + owKey;
  return combinedUVAPI;
}

// Functions builds the OpenWeather API request string to retrieve
// temp, humidity, wind speed data.
function buildAPIString(city) {
  var owAPIBase = "https://api.openweathermap.org/data/2.5/weather?q=";
  var country = ",us";
  var owUnits = "&units=imperial";
  var owKey = "&appid=5d00d98dfc178da12841d9b47f1fcc8f";
  var combinedAPI = owAPIBase + city + country + owUnits + owKey;
  return combinedAPI;
}

// Function saves the cities searched to local storage
function setLocalStore() {
  if (cities.length != 0) {
    localStorage.setItem("cities", JSON.stringify(cities));
  }
}

// Function retrieves the cities that have been searched form local storage
function getLocalStore() {
  var citiesRetrieval = localStorage.getItem("cities");
  var citiesRetrieved = JSON.parse(citiesRetrieval);
  cities = citiesRetrieved;
}

// Function builds date string for today in the format mm/dd/year
function buildDate() {
  var n = getNumMonth() + "/" + getNumDay() + "/" + getYear();
  return n;
}

//Function builds date string for today or a future date in the format mm/dd/year
function buildDateIncrement(count) {
  var dayIncrement = getNumDay() + count;
  var n = getNumMonth() + "/" + dayIncrement + "/" + getYear();
  return n;
}

// Functions below are used for testing only
function removeLocalStorage() {
  localStorage.removeItem("cities");
}

function consoleCity() {
  for (i = cities.length; i > 0; i--) {}
}
