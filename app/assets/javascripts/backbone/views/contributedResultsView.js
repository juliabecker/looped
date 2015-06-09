var Looped = Looped || {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {}
};

Looped.Views.ContributedResultsView = Backbone.View.extend({
  initialize: function() {
    this.listenTo(this.collection, 'add', this.addOne)
    this.collection.fetch();
  },
  attributes: {
    id: 'city-results-row'
  },
  className: 'row',
  el: 'div[data-id="results-container"]',
  template: _.template($('script[data-id="tip-result-template"]').text()),
  addOne: function(tipModel) {
    var newTipView = new Looped.Views.TipView({
      model: tipModel
    });
    newTipView.render();
    this.$el.append(newTipView.$el)
  }
});