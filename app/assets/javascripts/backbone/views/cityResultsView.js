var Looped = Looped || {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {}
};

Looped.Views.CityResultsView = Backbone.View.extend({
  initialize: function(options) {
    this.collection = new Looped.Collections.TipCollection({city_id: options.city_id, type: "city"});
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
    console.log('add one hit')
    var newTipView = new Looped.Views.TipView({
      model: tipModel
    });
    newTipView.render();
    this.$el.append(newTipView.$el)
    // Disable if favorited
    if (tipModel.get('favorited') === true) {
      var tipID = tipModel.get('id');
      $('.ui.rating').rating({
        initialRating: 1
      });
      $('.ui.rating').rating('disable');
    } else {
      $('.ui.rating').rating();
    }
  }
});