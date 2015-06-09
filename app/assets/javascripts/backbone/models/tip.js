var Looped = Looped || {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {}
};

Looped.Models.Tip = Backbone.Model.extend({
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