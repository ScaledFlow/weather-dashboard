// var cities = ["Atlanta", "Minneapolis", "New York"];
var cities = [];
var citiesStored = [];
var $citiesList = $("<ul>");
var searchCount = 0;
var itemCount = 0;

// commented out lines for testing purposes
//setLocalStore();
//getLocalStore();
//clearLocalStore();
//removeLocalStorage();
// clearCities();

init();

function init() {
  var citiesExist = localStorage.getItem("cities");
  if (citiesExist != null) {
    getLocalStore();
    for (i = cities.length; i > 0; i--) {
      buildCitiesSearch(cities[i - 1]);
    }
  }
}

function removeLocalStorage() {
  localStorage.removeItem("cities");
}

// Save plan description to dayPlan array on click event.
$(document).ready(function () {
  $("#search-btn").on("click", function () {
    var searchCity = $(".city-input").val().trim();
    $(".city-input").val("");
    pushCity(searchCity);
    setLocalStore();
    addCityToList(searchCity);
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

// create ul and add cities searched to sidebar UI after search button is clicked
function addCityToList(city) {
  if (searchCount === 0) {
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

function pushCity(city) {
  // cities.push(city);
  cities.unshift(city);
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
  console.log(cities);
  //localStorage.setItem("dayPlan", JSON.stringify(dayPlan));
}

function consoleCity() {
  for (i = cities.length; i > 0; i--) {
    console.log("cities in revers order = " + cities[i - 1]);
  }
}

// psuedo code

// init
// check to see if local storage has any cities in it and
// populate cities array if it does
// populate search city panel if it does
// populate main dashboard with the last city entry
// populate the 5 day forcast

// search
// push the city to the cities array
// save the city to local storage
// repopulate the side dash with the cities array
// look up the city in the weather API
// populate the main dash
// populate the 5 day forcast

// getCity
// when a city from the side dash is displayed and click
// get call the weather API
// populate the main dash
// populate the 5 day forcast
