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

  var Category = Backbone.Model.extend({
    urlRoot: 'api/categories'
  })

  var CategoryCollection = Backbone.Model.extend({
    url: 'api/categories',
    model: Category
  })

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
    initialize: function(options) {
      this.collection = options.collection
      this.render();
    },
    attributes: {
      class: 'row',
      id: 'city-results-row'
    },
    template: _.template($('script[data-id="tip-result-template"]').text()),
    render: function() {
      // Remove any existing results
      $('#city-results-row').remove()
      // Reformat tips for rendering in template 
      allTips = [];
      Object.keys(this.collection.attributes).forEach(function(key){
          allTips.push(this.collection.attributes[key]);
        }.bind(this))
      allTips.pop();
      this.$el.html(this.template(allTips));
      $('#main').append(this.$el);
      // Initialize favorite icon
      $('.ui.rating').rating(); 
    }
  });

  var CityDropdownView = Backbone.View.extend({
    initialize: function(options) {
      this.collection = options.collection;
      cities = this.collection.attributes;
      this.$el.attr('class', 'row');
      this.render();
    },
    template: _.template($('script[data-id="city-dropdown-template"]').text()),
    events: {
      'change': 'showCityResults'
    },
    showCityResults: function() {
      var cityID = $('.ui.dropdown').dropdown('get value');
      var tipCollection = new TipCollection({city_id: cityID})
      tipCollection.fetch({
        success: function(tips) {
          var cityResultsView = new CityResultsView({
            collection: tips
          })
        }
      })
    },
    render: function() {
      this.$el.html(this.template(cities));
      $('#main').append(this.$el)
      $('.ui.dropdown').dropdown();
    }

  });

  var MenuView = Backbone.View.extend({
    el: $('div[data-id="menu"]'),
    events: {
      'click [data-id="add-tip-button"]': function() {
        myRouter.navigate('add', {trigger:true})
      }
    }
  });

  var AddTipView = Backbone.View.extend({
    initialize: function(options) {
      this.collection = options.collection;
      cities = this.collection.attributes;
      this.currentUser = options.currentUser;
      categories = new CategoryCollection();
      categories.fetch({
        success: function(categories) {
          this.categories = categories.attributes;
          this.render();
        }.bind(this)
      });
    },
    attributes: {
      class: 'row'
    },
    events: {
      'click [data-action="submit-tip"]': 'addTip',
      'change [name="city-dropdown"]': 'checkIfNewCity'
    },
    template: _.template($('script[data-id="add-tip=template"]').text()),
    addTip: function(event) {
      var cityID = $('div[name="city-dropdown"]').dropdown('get value');
      // Add new city to database if new 
      if (cityID === "add-new") {
        var newCityName = $('input[data-id="new-city-field"]').val();
        var newCountryName = $('input[data-id="new-country-field"]').val();
        var newCityData = {city: newCityName, country: newCountryName};
        var newCity = new City(newCity);
        newCity.save(newCityData, {
          success: function(city) {
            cityID = city.get('id')
            this.saveTip(cityID)
          }.bind(this)
        })
      } else {
        this.saveTip(cityID)
      }
      
    },
    saveTip: function(cityID) {
      var categoryID = $('div[name="category-dropdown"]').dropdown('get value');
      var tipContent = $('textarea[name="tip"]').val();
      var newTip = {
        city_id: cityID,
        category_id: categoryID,
        content: tipContent,
        user_id: this.currentUser.id
      }
      var tip = new Tip(newTip)
      tip.save();
      myRouter.navigate('', {trigger:true})
    },
    // Display "Add New City" field if "Add New City" selected in dropdown
    checkIfNewCity: function() {
      var newCityField = $('div[data-id="add-new-city-field"]');
      var newCountryField = $('div[data-id="add-new-country-field"]');
      var citySelected = $('div[name="city-dropdown"]').dropdown('get value');

      if (citySelected === "add-new") {
        newCityField.removeClass("hidden-field");
        newCountryField.removeClass("hidden-field");
      } else {
        newCityField.addClass("hidden-field");
        newCountryField.addClass("hidden-field");
      }
    },
    render: function() {
      this.$el.html(this.template({cities: cities, categories: this.categories}));
      $('#main').append(this.$el)
      $('.ui.dropdown').dropdown();
    }
  });

  var Router = Backbone.Router.extend({
    initialize: function(currentUser) {
      this.currentUser = currentUser;
      var menuView = new MenuView();
    },
    routes: {
      '': 'index',
      'add': 'addATipView'
    },
    index: function() {
      $('#main').empty();
      var cities = new CityCollection();
      cities.fetch({
        success: function() {
          var cityDropdown = new CityDropdownView({
              collection: cities
           })
        }
      })
    },
    addATipView: function() {
      $('#main').empty();
      var cities = new CityCollection();
      cities.fetch({
        success: function() {
          var addTipView = new AddTipView({
            collection: cities,
            currentUser: this.currentUser
          })
        }.bind(this)
      })
    }
  });

  // Accounts for Facebook redirect URL with trailing #_=_
  if (window.location.hash && window.location.hash == '#_=_') {
        window.location.hash = '';
    }

  // Get user info on initial page load
  $.getJSON('/sessions').done(function(user) {
    window.myRouter = new Router(new User(user));
    Backbone.history.start();
  });

  

  
});