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
      $('#city-results-row').remove() // Remove any existing results
      allTips = [];
      Object.keys(this.collection.attributes).forEach(function(key){
          allTips.push(this.collection.attributes[key]);
        }.bind(this))
      allTips.pop();
      this.$el.html(this.template(allTips));
      $('#main').append(this.$el)
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
      this.render();
    },
    attributes: {
      class: 'row'
    },
    events: {
      'click [data-action="submit-tip"]': 'addTip'
    },
    template: _.template($('script[data-id="add-tip=template"]').text()),
    addTip: function(event) {
      var cityID = $('div[name="city-dropdown"]').dropdown('get value');
      var category = $('div[name="category-dropdown"]').dropdown('get value');
      var tipContent = $('textarea[name="tip"]').val();
      var tip = {

      }
      var tip = new Tip({})
    },
    render: function() {
      this.$el.html(this.template(cities));
      $('#main').append(this.$el)
      $('.ui.dropdown').dropdown();
    }
  });

  var Router = Backbone.Router.extend({
    initialize: function(currentUser) {
      this.currentUser = currentUser;
      console.log(currentUser)
      var menuView = new MenuView();
    },
    routes: {
      '': 'index',
      'add': 'addATipView'
    },
    index: function() {
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