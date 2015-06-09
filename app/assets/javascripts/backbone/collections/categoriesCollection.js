var Looped = Looped || {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {}
};

Looped.Collections.CategoryCollection = Backbone.Collection.extend({
    url: 'api/categories',
    model: Looped.Models.Category
  });