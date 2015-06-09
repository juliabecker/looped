var Looped = Looped || {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {}
};

Looped.Views.AddTipView = Backbone.View.extend({
  initialize: function() {
    this.render();
  },
  className: 'row',
  events: {
    'click [data-action="submit-tip"]': 'addTip',
    'change [name="city-dropdown"]': 'checkIfNewCity'
  },
  template: _.template($('script[data-id="add-tip=template"]').text()),
  addTip: function(event) {

    var cityID = $('div[name="city-dropdown"]').dropdown('get value');
    // Add new city to database if new 
    if (cityID === "add-new") {
      var newCityName = $('input[data-id="new-city-field"]').val();
      var newCountryName = $('input[data-id="new-country-field"]').val();
      var newCityData = {
        city: newCityName,
        country: newCountryName
      };
      var newCity = new Looped.Models.City(newCity);
      newCity.save(newCityData, {
        success: function(city) {
          cityID = city.get('id')
          this.saveTip(cityID)
        }.bind(this)
      });
      cities.add(newCity);
    } else {
      this.saveTip(cityID)
    }
  },
  saveTip: function(cityID) {
    var categoryID = $('div[name="category-dropdown"]').dropdown('get value');
    var tipContent = $('textarea[name="tip"]').val();
    var newTip = {
      city_id: cityID,
      category_id: categoryID,
      content: tipContent,
      user_id: currentUser.get('id')
    }
    var tip = new Looped.Models.Tip({
      type: "city",
      city_id: cityID
    })
    tip.save(newTip);
    router.navigate('', {
      trigger: true
    })
  },
  // Display "Add New City" field if "Add New City" selected in dropdown
  checkIfNewCity: function() {
    var newCityField = $('div[data-id="add-new-city-field"]');
    var newCountryField = $('div[data-id="add-new-country-field"]');
    var citySelected = $('div[name="city-dropdown"]').dropdown('get value');

    if (citySelected === "add-new") {
      newCityField.removeClass("hidden-field");
      newCountryField.removeClass("hidden-field");
    } else {
      newCityField.addClass("hidden-field");
      newCountryField.addClass("hidden-field");
    }
  },
  render: function() {
    citiesArray = [];
    cities.each(function(city) {
      citiesArray.push(city.attributes)
    });
    categoriesArray = [];
    categories.each(function(category) {
      categoriesArray.push(category.attributes);
    })
    this.$el.html(this.template({
      cities: citiesArray,
      categories: categoriesArray
    }));
    $('#main').append(this.$el)
    $('.ui.dropdown').dropdown();
  }
});