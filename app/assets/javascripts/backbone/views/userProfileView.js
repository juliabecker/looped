var Looped = Looped || {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {}
};

Looped.Views.UserProfileView = Backbone.View.extend({
  initialize: function() {
    this.render();
  },
  template: _.template($('script[data-id="user-profile"]').text()),
  className: 'eleven wide column',
  attributes: {
    'style': 'text-align:center'
  },
  events: {
    'click a[data-id="contributed-tab"]': 'showContributed',
    'click a[data-id="favorites-tab"]': 'showFavorites'
  },
  showFavorites: function() {
    $('a[data-id="favorites-tab"]').addClass('active');
    $('a[data-id="contributed-tab"]').removeClass('active');
    $('div[data-id="results-container"]').empty();
    var favoriteTipsArray = favorites.pluck('tip');
    var favoriteTips = new Looped.Collections.TipCollection(favoriteTipsArray)
    var favoriteResultsView = new Looped.Views.FavoriteResultsView({
      collection: favoriteTips
    })
  },
  showContributed: function() {
    $('a[data-id="contributed-tab"]').addClass('active');
    $('a[data-id="favorites-tab"]').removeClass('active');
    $('div[data-id="results-container"]').empty();
    var contributedTips = new Looped.Collections.TipCollection({
      type: "contributed"
    });
    var contributedResultsView = new Looped.Views.ContributedResultsView({
      collection: contributedTips
    })
  },
  render: function() {
    this.$el.html(this.template(currentUser.attributes));
    $('#main').append(this.$el)
  }
});
