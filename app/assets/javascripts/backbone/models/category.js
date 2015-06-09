var Looped = Looped || {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {}
};

Looped.Models.Category = Backbone.Model.extend({
    urlRoot: 'api/categories'
  });