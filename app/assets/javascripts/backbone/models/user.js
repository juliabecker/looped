var Looped = Looped || {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {}
};

Looped.Models.User = Backbone.Model.extend({
    urlRoot: 'api/users'
  });