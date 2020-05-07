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

// commented out lines for testing purposes
//setLocalStore();
//getLocalStore();
//clearLocalStore();
//removeLocalStorage();
// clearCities();

function init() {
  var citiesExist = localStorage.getItem("cities");
  if (citiesExist != null) {
    getLocalStore();
    //populateMainDashboard(cities[0]);
    for (i = cities.length; i > 0; i--) {
      buildCitiesSearch(cities[i - 1]);
    }
  }
}

// Search button click event.
$(document).ready(function () {
  $("#search-btn").on("click", function () {
    var searchCity = $(".city-input").val().trim();
    $(".city-input").val("");
    if (searchCity != "") {
      unshiftCity(searchCity);
      setLocalStore();
      buildCitiesSearch(searchCity);
      owAPICall(searchCity);
      // populateMainDashboard(searchCity);
    }
  });
});

function owAPICall(city) {
  var queryURL = buildAPIString(city);
  console.log("this is the result = " + queryURL);
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
      console.log("fetch main cloud value = " + mainCloudValue);
      var descValue = data["weather"][0]["description"];
      var humValue = data["main"]["humidity"];
      var windValue = data["wind"]["speed"];
      latValue = data["coord"]["lat"];
      console.log("initial get of lat = " + latValue);
      lonValue = data["coord"]["lon"];
      console.log("initial get of lon = " + lonValue);
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

  //owUVAPICall(latValue, lonValue);
  // first value is lat (small) second value is long (larger)
  // owUVAPICall(lonValue, latValue);
}

function updatePage(openWeather) {
  console.log("what is this = " + openWeather);
}

// Past cities search click event.
$(document).ready(function () {
  $(".list-group-item").on("click", function () {
    // var clickedCity = $(this).val();
    var clickedCity = $("list-group-city-6").val();
    console.log("clicked city = " + clickedCity);

    // $(".city-input").val("");
    // if (searchCity != "") {
    //   unshiftCity(searchCity);
    //   setLocalStore();
    //   buildCitiesSearch(searchCity);
    //   populateMainDashboard(searchCity);
    // }
  });
});

// Populate city side bar with past searches when application launches
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
}

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
      console.log("You blew it in getWeatherIcon !!!!!!!!!!!!!!");
  }
}

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

function unshiftCity(city) {
  cities.unshift(city);
}

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

var cityTest = "Austin";
console.log("five day string = " + buildFiveDayString(cityTest));

function buildFiveDayString(cityTest) {
  var owAPIBase = "https://api.openweathermap.org/data/2.5/forecast?q=";
  var owCity = cityTest;
  var owAppId = "&appid=";
  var owKey = "5d00d98dfc178da12841d9b47f1fcc8f";
  var combinedForcastAPI = owAPIBase + owCity + owAppId + owKey;
  console.log("forcast string = " + combinedForcastAPI);
  var queryURL = combinedForcastAPI;
  fetch(queryURL)
    .then((response) => response.json())
    .then((data) => {
      // Increment values in the API array (6, 14, 22, 30, 38)
      var dayIncr = 6;
      var tempValueDay;
      var humidityValueDay;
      var skyValueDay;

      for (i = 0; i < 5; i++) {
        // Populate five day forcast date
        $("#five-day-date-" + (i + 1))
          .empty()
          .append(buildDateIncrement(i + 1));

        // Populate five day forcast temp
        tempValueDay = data["list"][dayIncr]["main"]["temp"];
        $("#five-day-temp-" + (i + 1))
          .empty()
          .append("Temp: " + kelvinToFahr(tempValueDay));

        // Populate five day forcast hunidity
        humidityValueDay = data["list"][dayIncr]["main"]["humidity"];
        $("#five-day-humidity-" + (i + 1))
          .empty()
          .append("Humidity: " + humidityValueDay);

        // Populate five day forcast cloud cover
        skyValueDay = data["list"][dayIncr]["weather"][0]["main"];
        console.log("five day skyValue = " + skyValueDay);
        getWeatherIcon(skyValueDay);
        console.log("five day skyValue icon = " + weatherIcon);
        $("#five-day-sky-" + (i + 1))
          .empty()
          .append(weatherIcon);

        // Increment through the API where 8 equals a 24 hour period
        dayIncr = dayIncr + 8;
      }
    });
}

function kelvinToFahr(temp) {
  var n = ((temp - 273.15) * 9) / 5 + 32;
  n = Math.floor(n);
  return n;
}

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

function buildAPIString(city) {
  var owAPIBase = "https://api.openweathermap.org/data/2.5/weather?q=";
  var country = ",us";
  var owUnits = "&units=imperial";
  var owKey = "&appid=5d00d98dfc178da12841d9b47f1fcc8f";
  var combinedAPI = owAPIBase + city + country + owUnits + owKey;
  return combinedAPI;
}

function setLocalStore() {
  if (cities.length != 0) {
    localStorage.setItem("cities", JSON.stringify(cities));
  }
}

function getLocalStore() {
  var citiesRetrieval = localStorage.getItem("cities");
  var citiesRetrieved = JSON.parse(citiesRetrieval);
  cities = citiesRetrieved;
}

function consoleCity() {
  for (i = cities.length; i > 0; i--) {}
}

buildDate();

function buildDate() {
  var n = getNumMonth() + "/" + getNumDay() + "/" + getYear();
  return n;
}

var incrementResult = buildDateIncrement(5);
{
  console.log("increment resulte = " + incrementResult);
}

function buildDateIncrement(count) {
  var dayIncrement = getNumDay() + count;
  console.log("incremented day = " + dayIncrement);

  var n = getNumMonth() + "/" + dayIncrement + "/" + getYear();
  console.log("(" + getNumMonth() + "/" + getNumDay() + "/" + getYear() + ")");
  return n;
}

function removeLocalStorage() {
  localStorage.removeItem("cities");
}
