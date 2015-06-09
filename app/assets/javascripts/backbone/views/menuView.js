var Looped = Looped || {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {}
};

Looped.Views.MenuView = Backbone.View.extend({
  el: $('div[data-id="menu"]'),
  events: {
    'click [data-id="add-tip-button"]': function() {
      router.navigate('add', {
        trigger: true
      })
    },
    'click #menu-image': function() {
      router.navigate('users/' + currentUser.get('id'), {
        trigger: true
      })
    }
  }
});