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
  });

  var Favorite = Backbone.Model.extend({
    urlRoot: function() {
      return 'api/users/' + this.get('user_id') + '/favorites'
    }
  });

  // ------------------ COLLECTIONS ------------------

  var FavoriteCollection = Backbone.Collection.extend({
    url: function() {
      return 'api/users/' + this.get('user_id') + '/favorites'
    },
    model: Favorite
  });

  var CategoryCollection = Backbone.Collection.extend({
    url: 'api/categories',
    model: Category
  });

  var CityCollection = Backbone.Collection.extend({
    url: 'api/cities',
    model: City
  });

  var TipCollection = Backbone.Collection.extend({
    initialize: function(options) {
      this.city_id = options.city_id;
    },
    url: function() {
      return 'api/cities/' + this.city_id + '/tips'
    },
    model: Tip
  });

  // ------------------ VIEWS ------------------

  var TipView = Backbone.View.extend({
    initialize: function() {
      this.listenTo(this.model, 'change', this.render)
    },
    className: 'tip item',
    template: _.template($('script[data-id="tip-result-template"]').text()),
    events: {
      'click .ui.rating': 'addTipToFavorites'
    },
    addTipToFavorites: function(event) {
      var tipID = $(event.target).parent().parent().parent().attr('data-id')
      var newFavorite = {tip_id: tipID, user_id: currentUser.get('id')}
      var favorite = new Favorite(newFavorite);
    },
    render: function() {
      this.$el.html(this.template(this.model.attributes))

    }
  });

  var CityResultsView = Backbone.View.extend({
    initialize: function(options) {
      this.listenTo(this.collection, 'add', this.addOne)
      this.collection.fetch();
    },
    attributes: {
      id: 'city-results-row'
    },
    className: 'row',
    el: 'div[data-id="results-container"]',
    template: _.template($('script[data-id="tip-result-template"]').text()),
    addOne: function(tipModel) {
      var newTipView = new TipView({model: tipModel});
      newTipView.render();
      this.$el.append(newTipView.$el)
      $('.ui.rating').rating();
    },

    // render: function() {
    //   console.log(tips.models)
    //   // Remove any existing results
    //   $('#city-results-row').remove()
    //   tipsArray = [];
    //   tips.each(function(tip) {
    //     console.log(tip.attributes)
    //     tipsArray.push(tip.attributes)
    //   });
    //   this.$el.html(this.template({tips: tipsArray}));
    //   $('#main').append(this.$el);
    //   // Initialize favorite icon
    //   $('.ui.rating').rating(); 
    // }
  });

  var CityDropdownView = Backbone.View.extend({
    initialize: function() {
      this.render();
    },
    className: 'row',
    template: _.template($('script[data-id="city-dropdown-template"]').text()),
    events: {
      'change': 'showCityResults'
    },
    showCityResults: function() {
      $('div[data-id="results-container"]').empty()
      var cityID = $('.ui.dropdown').dropdown('get value');
      tips = new TipCollection({city_id: cityID});
      var cityResultsView = new CityResultsView({collection: tips});
    },
    render: function() {
      var citiesArray = [];
      cities.each(function(city) {
        citiesArray.push(city.attributes)
      });
      this.$el.html(this.template({cities: citiesArray}));
      $('#main').append(this.$el)
      $('.ui.dropdown').dropdown();
    }

  });

  var MenuView = Backbone.View.extend({
    el: $('div[data-id="menu"]'),
    events: {
      'click [data-id="add-tip-button"]': function() {
        myRouter.navigate('add', {trigger:true})
      },
      'click #menu-image': function() {
        myRouter.navigate('user/' + currentUser.get('id'), {trigger:true})
      }
    }
  });

  var AddTipView = Backbone.View.extend({
    initialize: function() {
      this.render();
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
        user_id: currentUser.get('id')
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
      citiesArray = [];
      cities.each(function(city) {
        citiesArray.push(city.attributes)
      });
      categoriesArray = [];
      categories.each(function(category) {
        categoriesArray.push(category.attributes);
      })
      this.$el.html(this.template({cities: citiesArray, categories: categoriesArray}));
      $('#main').append(this.$el)
      $('.ui.dropdown').dropdown();
    }
  });

  var UserProfileView = Backbone.View.extend({
    initialize: function() {
      console.log(currentUser)
    }
  });

  // ------------------ ROUTER ------------------

  var Router = Backbone.Router.extend({
    initialize: function() {
      var menuView = new MenuView();
      cities = new CityCollection();
      categories = new CategoryCollection();
      cities.fetch();
      categories.fetch();
    },
    routes: {
      '': 'index',
      'add': 'addATipView',
      'users/:id': 'userProfileView'
    },
    index: function() {
      $('#main').empty();
      var cityDropdown = new CityDropdownView();
    },
    addATipView: function() {
      $('#main').empty();
      var addTipView = new AddTipView()
    },
    userProfileView: function(user_id) {
      $('#main').empty();
      var userProfileView = new UserProfileView();
    }
  });

  // Accounts for Facebook redirect URL with trailing #_=_
  if (window.location.hash && window.location.hash == '#_=_') {
        window.location.hash = '';
  }

  var currentUser;
  var cities;
  var categories;
  var tips;

  var myRouter = new Router();

  $.getJSON('/sessions').done(function(user) {
    currentUser = new User(user);
    Backbone.history.start();
  });

  // Get user info on initial page load
  // $.getJSON('/sessions').done(function(user) {
  //   window.myRouter = new Router(new User(user));
  //   Backbone.history.start();
  // });

  
});