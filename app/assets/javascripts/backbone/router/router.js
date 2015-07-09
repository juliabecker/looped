var Looped = Looped || {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {}
};

Looped.Routers.Router = Backbone.Router.extend({
  initialize: function() {
    var menuView = new Looped.Views.MenuView();
  },
  routes: {
    '': 'index',
    'add': 'addATipView',
    'users/:id': 'userProfileView'
  },
  index: function() {
    console.log('index hit')
    $('#main').empty();
    var cityDropdown = new Looped.Views.CityDropdownView({
      collection: cities
    });
  },
  addATipView: function() {
    $('#main').empty();
    var addTipView = new Looped.Views.AddTipView();
  },
  userProfileView: function(user_id) {
    $('#main').empty();
    var userProfileView = new Looped.Views.UserProfileView({
      collection: favorites
    });
    userProfileView.showFavorites();
  }
});