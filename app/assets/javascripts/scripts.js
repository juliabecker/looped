console.log("scripts.js linked");

// ------------------ MODELS ------------------

var User = Backbone.Model.extend({
  urlRoot: 'api/users'
});

var City = Backbone.Model.extend({
  urlRoot: 'api/cities'
});

var Tip = Backbone.Model.extend({
  initialize: function(options) {
    this.type = options.type;

    if (favorites.findWhere({
        tip_id: this.get('id')
      })) {
      this.set('favorited', true)
    } else {
      this.set('favorited', false)
    }

    if (this.type == "city") {
      this.urlRoot = function() {
        return '/api/cities/' + options.city_id + '/tips'
      }
    } else if (this.type == "favorites") {
      this.urlRoot = 'api/favorite-tips'
    } else if (this.type == "contributed") {
      this.urlRoot = function() {
        return '/api/users/' + currentUser.id + '/tips'
      }
    }
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
  initialize: function(options) {
    this.user_id = options.user_id;
  },
  url: function() {
    return 'api/users/' + this.user_id + '/favorites'
  },
  model: Favorite
});

var CategoryCollection = Backbone.Collection.extend({
  url: 'api/categories',
  model: Category
});

var CityCollection = Backbone.Collection.extend({
  initialize: function() {
    this.sort();
  },
  url: 'api/cities',
  model: City,
  comparator: function(cityModel) {
    return cityModel.get('city');
  }
});

var TipCollection = Backbone.Collection.extend({
  initialize: function(options) {
    this.type = options.type
    if (this.type == "city") {
      this.city_id = options.city_id;
      this.url = function() {
        return 'api/cities/' + this.city_id + '/tips'
      }
    } else if (this.type == "contributed") {
      this.url = function() {
        return 'api/users/' + currentUser.id + '/tips'
      }
    } else {
      this.url = 'api/favorite-tips'
    }
  },
  model: Tip
});


// ------------------ VIEWS ------------------

var MenuView = Backbone.View.extend({
  el: $('div[data-id="menu"]'),
  events: {
    'click [data-id="add-tip-button"]': function() {
      router.navigate('add', {
        trigger: true
      })
    },
    'click #menu-image': function() {
      router.navigate('users/' + currentUser.get('id'), {
        trigger: true
      })
    }
  }
});

var TipView = Backbone.View.extend({
  initialize: function() {
    this.listenTo(this.model, 'change', this.render)
  },
  className: 'tip stackable item',
  template: _.template($('script[data-id="tip-result-template"]').text()),
  events: {
    'click .ui.rating': 'addTipToFavorites'
  },
  addTipToFavorites: function(event) {
    var tipID = $(event.target).parent().data('id');
    var newFavorite = {
      tip_id: tipID,
      user_id: currentUser.get('id')
    }
    var favorite = favorites.create(newFavorite)
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
    var newTipView = new TipView({
      model: tipModel
    });
    newTipView.render();
    this.$el.append(newTipView.$el)
    // Favorite icon enabled on home view
    $('p[data-id="city-title"]').css('display', 'none');
    // Disable if favorited
    if (tipModel.get('favorited') === true) {
      var tipID = tipModel.get('id');
      $('.ui.rating').rating({
        initialRating: 1
      });
      $('.ui.rating').rating('disable');
    } else {
      $('.ui.rating').rating();
    }
  }
});

var FavoriteResultsView = Backbone.View.extend({
  initialize: function() {
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
    var newTipView = new TipView({
      model: tipModel
    });
    newTipView.render();
    this.$el.append(newTipView.$el)
    $('.ui.rating').rating({
      initialRating: 1
    });
    $('.ui.rating').rating('disable');
  }
});

var ContributedResultsView = Backbone.View.extend({
  initialize: function() {
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
    var newTipView = new TipView({
      model: tipModel
    });
    newTipView.render();
    this.$el.append(newTipView.$el)
  }

});

var CityDropdownView = Backbone.View.extend({
  initialize: function() {
    this.collection.fetch({
      success: function() {
        this.render();
      }.bind(this)
    });
  },
  className: 'row',
  template: _.template($('script[data-id="city-dropdown-template"]').text()),
  events: {
    'change': 'showCityResults'
  },
  showCityResults: function() {
    $('div[data-id="results-container"]').empty()
    var cityID = $('.ui.dropdown').dropdown('get value');
    tips = new TipCollection({
      city_id: cityID,
      type: "city"
    });
    var cityResultsView = new CityResultsView({
      collection: tips
    });
  },
  render: function() {
    var citiesArray = [];
    cities.each(function(city) {
      citiesArray.push(city.attributes)
    });
    this.$el.html(this.template({
      cities: citiesArray
    }));
    $('#main').append(this.$el)
    $('.ui.dropdown').dropdown();
  }

});

var AddTipView = Backbone.View.extend({
  initialize: function() {
    this.render();
  },
  className: 'row',
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
      var newCityData = {
        city: newCityName,
        country: newCountryName
      };
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
    var tip = new Tip({
      type: "city",
      city_id: cityID
    })
    tip.save(newTip);
    router.navigate('', {
      trigger: true
    })
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
    this.$el.html(this.template({
      cities: citiesArray,
      categories: categoriesArray
    }));
    $('#main').append(this.$el)
    $('.ui.dropdown').dropdown();
  }
});

var UserProfileView = Backbone.View.extend({
  initialize: function() {
    this.render();
  },
  template: _.template($('script[data-id="user-profile"]').text()),
  className: 'eleven wide column',
  attributes: {
    'style': 'text-align:center'
  },
  events: {
    'click a[data-id="contributed-tab"]': 'showContributed',
    'click a[data-id="favorites-tab"]': 'showFavorites'
  },
  showFavorites: function() {
    $('a[data-id="favorites-tab"]').addClass('active');
    $('a[data-id="contributed-tab"]').removeClass('active');
    $('div[data-id="results-container"]').empty();
    var favoriteTipsArray = favorites.pluck('tip');
    var favoriteTips = new TipCollection(favoriteTipsArray)
    var favoriteResultsView = new FavoriteResultsView({
      collection: favoriteTips
    })
  },
  showContributed: function() {
    $('a[data-id="contributed-tab"]').addClass('active');
    $('a[data-id="favorites-tab"]').removeClass('active');
    $('div[data-id="results-container"]').empty();
    var contributedTips = new TipCollection({
      type: "contributed"
    });
    var contributedResultsView = new ContributedResultsView({
      collection: contributedTips
    })
  },
  render: function() {
    this.$el.html(this.template(currentUser.attributes));
    $('#main').append(this.$el)
  }
});


// ------------------ ROUTER ------------------

var Router = Backbone.Router.extend({
  initialize: function() {
    var menuView = new MenuView();
    // favorites = new FavoriteCollection({user_id: currentUser.get('id')});
    // favorites.fetch();
  },
  routes: {
    '': 'index',
    'add': 'addATipView',
    'users/:id': 'userProfileView'
  },
  index: function() {
    $('#main').empty();
    var cityDropdown = new CityDropdownView({
      collection: cities
    });
  },
  addATipView: function() {
    $('#main').empty();
    var addTipView = new AddTipView();
  },
  userProfileView: function(user_id) {
    $('#main').empty();
    var userProfileView = new UserProfileView({
      collection: favorites
    });
    userProfileView.showFavorites();
  }
});

// Global variables
// Collections
var router;
var currentUser;
var tips;
var favorites;
// Option variables
var type;
// Bootstrapped Models
var cities = new CityCollection(allCities);
var categories = new CategoryCollection(allCategories)

// Get current user & current user favorites on page load
$.getJSON('/sessions').done(function(user) {
  favorites = new FavoriteCollection({
    user_id: user.id
  });
  favorites.fetch({
    success: function(favorites) {
      currentUser = new User(user)
      router = new Router();
      Backbone.history.start();
    }
  })
});

// Accounts for Facebook redirect URL with trailing #_=_
if (window.location.hash && window.location.hash == '#_=_') {
  window.location.hash = '';
}