// var cities = ["Atlanta", "Minneapolis", "New York"];
var cities = [];
var citiesStored = [];
var $citiesList = $("<ul>");
var searchCount = 0;
var itemCount = 0;
var blankCity = "";
var mainCloudValue = "";
var weatherIcon = "";

// commented out lines for testing purposes
//setLocalStore();
//getLocalStore();
//clearLocalStore();
//removeLocalStorage();
// clearCities();

// var result = buildAPIString("minneapolis");
// console.log("this is the result = " + result);

function buildAPIString(city) {
  var owAPIBase = "api.openweathermap.org/data/2.5/weather?q=";
  var owUnits = "&units=imperial";
  var owKey = "&appid=5d00d98dfc178da12841d9b47f1fcc8f";
  var combinedAPI = owAPIBase + city + owUnits + owKey;
  return combinedAPI;
}

init();

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
      var latValue = data["coord"]["lat"];
      var lonValue = data["coord"]["lon"];

      getWeatherIcon(cloudValue);
      $("#main-card-city")
        .empty()
        .append(city + " " + buildDate() + " " + weatherIcon);
      $("#main-card-temp")
        .empty()
        .append("Temperature: " + tempValue + "<span> &#8457</span>");
      $("#main-card-hum")
        .empty()
        .append("Humidity: " + humValue + "<span>&#37</span>");
      $("#main-card-wind")
        .empty()
        .append("Wind Speed: " + windValue + "<span> MPH</span>");
      $("#main-card-uv-index")
        .empty()
        .append("UV Index: " + tempValue + "<span> &#8457</span>");
    })

    .catch((err) => alert("wrong city name"));
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
  console.log("value of weatherMain in getweather = " + weatherMain);

  switch (weatherMain) {
    case "Rain":
      weatherIcon = '<i class="fas fa-cloud-showers-heavy"></i>';
      console.log("*****Rain******");
      break;
    case "Clouds":
      weatherIcon = '<i class="fas fa-cloud"></i>';
      console.log("*****Clouds******");
      break;
    case "Clear":
      weatherIcon = '<i class="fas fa-sun"></i>';
      console.log("*****Clear******");
      console.log("weather Icon = " + weatherIcon);
      break;

    default:
      console.lot("You blew it in getWeatherIcon !!!!!!!!!!!!!!");
  }
}

function mainCloudIcon(cloudValue) {}

function unshiftCity(city) {
  cities.unshift(city);
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
  for (i = cities.length; i > 0; i--) {
    console.log("cities in revers order = " + cities[i - 1]);
  }
}

buildDate();

function buildDate() {
  var n = "(" + getNumMonth() + "/" + getNumDay() + "/" + getYear() + ")";
  console.log("(" + getNumMonth() + "/" + getNumDay() + "/" + getYear() + ")");
  return n;
}

function removeLocalStorage() {
  localStorage.removeItem("cities");
}
