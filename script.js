var cities = ["Atlanta", "Minneapolis", "New York"];
var citiesStored = [];
var $citiesList = $("<ul>");
var searchCount = 0;
var itemCount = 0;

init();
//pushCity("Denver");
setLocalStore();
//getLocalStore();
//clearLocalStore();
consoleCity();
// addCityToList();
//removeLocalStorage();

// clearCities();

function init() {}

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

// create ul and add cities searched to sidebar UI
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
  cities.push(city);
  consoleCity();
}

function setLocalStore() {
  if (cities.length != 0) {
    localStorage.setItem("cities", JSON.stringify(cities));
  }
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
