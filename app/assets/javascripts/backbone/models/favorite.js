var Looped = Looped || {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {}
};

Looped.Models.Favorite = Backbone.Model.extend({
  urlRoot: function() {
    return 'api/users/' + this.get('user_id') + '/favorites'
  }
});