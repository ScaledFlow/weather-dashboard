var cities = ["Atlanta", "Minneapolis", "New York"];
var citiesStored = [];

init();
//pushCity("Denver");
setLocalStore();
//getLocalStore();
//clearLocalStore();
consoleCity();
addCityToList();
//removeLocalStorage();

// clearCities();

function init() {}

function pushCity(city) {
  cities.push(city);
  // console.log(cities);
  consoleCity();
}

function setLocalStore() {
  if (cities.length != 0) {
    // console.log(cities);
    localStorage.setItem("cities", JSON.stringify(cities));
  }
}

function consoleCity() {
  for (i = cities.length; i > 0; i--) {
    console.log("cities in revers order = " + cities[i - 1]);
  }
}

function removeLocalStorage() {
  localStorage.removeItem("cities");
}

// Save plan description to dayPlan array on click event.
$(document).ready(function () {
  $("#search-btn").on("click", function () {
    var searchCity = $(".city-input").val().trim();
    console.log("searchCity = " + searchCity);
    pushCity(searchCity);
    setLocalStore();
    addCityToList(searchCity);
  });
});

function addCityToList(city) {
  var $cityListItem = $("<li class='search-cities-list'></li>");
  $cityListItem.addClass("list-group-item");
  $cityListItem.text(city);
  $("#cities-searched-section").append($cityListItem);
  console.log("addCityToList");
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
