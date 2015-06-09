var Looped = Looped || {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {}
};

Looped.Models.City = Backbone.Model.extend({
    urlRoot: 'api/cities'
  });