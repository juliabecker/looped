var Looped = Looped || {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {}
};

Looped.Collections.TipCollection = Backbone.Collection.extend({
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
  model: Looped.Models.Tip
});