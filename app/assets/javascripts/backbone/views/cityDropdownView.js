var Looped = Looped || {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {}
};

Looped.Views.CityDropdownView = Backbone.View.extend({
  initialize: function(options) {
    this.$el.attr('class', 'row');
    this.render();
  },
  template: _.template($('script[data-id="city-dropdown-template"]').text()),
  events: {
    'change': 'showCityResults'
  },
  showCityResults: function() {
    var cityID = $('.ui.dropdown').dropdown('get value');
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