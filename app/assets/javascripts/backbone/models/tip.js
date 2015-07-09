var Looped = Looped || {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {}
};

Looped.Models.Tip = Backbone.Model.extend({
  initialize: function(options) {
    this.type = options.type;

    // If user signed in, check for favorites
    if (favorites) {
      if (favorites.findWhere({
        tip_id: this.get('id')
      })) {
        this.set('favorited', true)
      } else {
        this.set('favorited', false)
      }
    }

    // Tips to be displayed in city results
    if (this.type == "city") {
      this.urlRoot = function() {
        return '/api/cities/' + options.city_id + '/tips'
      }
    // Tips to be displayed in user/favorites section
    } else if (this.type == "favorites") {
      this.urlRoot = 'api/favorite-tips'
    // Tips to be displayed in user/contributed section
    } else if (this.type == "contributed") {
      this.urlRoot = function() {
        return '/api/users/' + currentUser.id + '/tips'
      }
    }
  }
});