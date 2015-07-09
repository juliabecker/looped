var Looped = Looped || {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {}
};

// Global variables
// Collections
var router;
var currentUser;
var tips;
var favorites;

// Option variables
var type;
// Bootstrapped Models
var cities = new Looped.Collections.CityCollection(allCities);
var categories = new Looped.Collections.CategoryCollection(allCategories)

Looped.initialize = function() {
 router = new Looped.Routers.Router();
 Backbone.history.start();
}

// Accounts for Facebook redirect URL with trailing #_=_
if (window.location.hash && window.location.hash == '#_=_') {
  window.location.hash = '';
}

$(function(){
  Looped.initialize();
})