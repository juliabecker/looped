var Looped = Looped || {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {}
};

Looped.Views.CityDropdownView = Backbone.View.extend({
  initialize: function(options) {
    this.$el.attr('class', 'row');
    this.collection.fetch({
      success: function(cityData) {
        cities = cityData
        this.render();
      }.bind(this)
    })
  },
  template: _.template($('script[data-id="city-dropdown-template"]').text()),
  events: {
    'change': 'showCityResults'
  },
  showCityResults: function() {
    var cityID = $('.ui.dropdown').dropdown('get value');
    $('div[data-id="results-container"]').empty();
    var cityResultsView = new Looped.Views.CityResultsView({city_id: cityID})
  },
  render: function() {
    var cities = [];
    this.collection.each(function(city) {
      cities.push(city.attributes)
    });
    this.$el.html(this.template({
      cities: cities
    }));
    $('#main').append(this.$el)
    $('.ui.dropdown').dropdown();
  }
});