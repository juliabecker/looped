var Looped = Looped || {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {}
};

Looped.Routers.Router = Backbone.Router.extend({
  routes: {
    '': 'index',
  },
  index: function() {
    $('#main').empty();
    var cityDropdown = new Looped.Views.CityDropdownView({
      collection: cities
    });
  }
});