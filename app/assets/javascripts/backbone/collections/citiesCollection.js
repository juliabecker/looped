var Looped = Looped || {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {}
};

Looped.Collections.CityCollection = Backbone.Collection.extend({
  initialize: function() {
    this.sort();
  },
  url: 'api/cities',
  model: Looped.Models.City,
  comparator: function(cityModel) {
    return cityModel.get('city');
  }
});