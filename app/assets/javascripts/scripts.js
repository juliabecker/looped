$(function() {

  console.log("scripts.js linked");

  // ------------------ MODELS ------------------

  var User = Backbone.Model.extend({
    urlRoot: 'api/users'
  });

  var City = Backbone.Model.extend({
    urlRoot: 'api/cities'
  });

  var Tip = Backbone.Model.extend({
    urlRoot: function() {
      return 'api/cities/' + this.get('city_id') + '/tips'
    }
  });

  var CityCollection = Backbone.Model.extend({
    url: 'api/cities',
    model: City
  });

  var TipCollection = Backbone.Model.extend({
    initialize: function(options) {
      this.city_id = options.city_id;
    },
    url: function() {
      return 'api/cities/' + this.get('city_id') + '/tips/'
    },
    model: Tip
  });

  var CityResultsView = Backbone.View.extend({

  });

  var CityDropdownView = Backbone.View.extend({
    initialize: function(options) {
      this.collection = options.collection;
      cities = this.collection.attributes;
      this.render();
    },
    el: $('#dropdown-row'),
    template: _.template($('script[data-id="city-dropdown-template"]').text()),
    events: {
      'change': 'showCityResults'
    },
    showCityResults: function() {
      var cityID = $('.ui.dropdown').dropdown('get value');
      var tipCollection = new TipCollection({city_id: cityID})
      tipCollection.fetch({
        success: function(data) {
          console.log(data)
        }
      })
      // cityResults = new CityResultsView({

      // })
    },
    render: function() {
      this.$el.html(this.template(cities));
      $('.ui.dropdown').dropdown();
    }

  });

  var Router = Backbone.Router.extend({
    initialize: function(currentUser) {
      this.currentUser = currentUser;
    },
    routes: {
      '': 'index'
    },
    index: function() {
      var cities = new CityCollection();
      cities.fetch({
        success: function() {
          var cityDropdown = new CityDropdownView({
              // el: $('#dropdown-row'),
              collection: cities
           })
        }
      })
    }
  });

  $.getJSON('/sessions').done(function(user) {
    window.myRouter = new Router(new User(user));
    Backbone.history.start();
  });

  
});