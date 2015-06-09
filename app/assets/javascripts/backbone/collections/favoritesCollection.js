var Looped = Looped || {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {}
};

Looped.Collections.FavoriteCollection = Backbone.Collection.extend({
  initialize: function(options) {
    this.user_id = options.user_id;
  },
  url: function() {
    return 'api/users/' + this.user_id + '/favorites'
  },
  model: Looped.Models.Favorite
});