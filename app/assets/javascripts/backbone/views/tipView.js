var Looped = Looped || {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {}
};

Looped.Views.TipView = Backbone.View.extend({
  initialize: function() {
    this.listenTo(this.model, 'change', this.render)
  },
  className: 'tip stackable item',
  template: _.template($('script[data-id="tip-result-template"]').text()),
  events: {
    'click .ui.rating': 'addTipToFavorites'
  },
  addTipToFavorites: function(event) {
    var tipID = $(event.target).parent().data('id');
    var newFavorite = {
      tip_id: tipID,
      user_id: currentUser.get('id')
    }
    var favorite = favorites.create(newFavorite)
  },
  render: function() {
    this.$el.html(this.template(this.model.attributes))
  }
});