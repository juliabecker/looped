# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

User.delete_all
City.delete_all
Tip.delete_all
Favorite.delete_all
Category.delete_all

# julia_friends = [{facebook_id: 1032810096}, {facebook_id: 1032810162}]
# georgina_friends = [{facebook_id: 1032810098}, {facebook_id: 1032810162}]
# miranda_friends = [{facebook_id: 1032810098}, {facebook_id: 1032810096}]

# julia = User.create!({facebook_id: 1032810098, first_name: "Julia", last_name: "Becker", email: "jcbecker26@gmail.com", picture: "https://scontent-sjc2-1.xx.fbcdn.net/hphotos-xfp1/v/t1.0-9/10421428_10204171849589786_7675723999945044713_n.jpg?oh=0add4275a2572a54084cf48b79d35e11&oe=55FBBFEF", friends: julia_friends })
# georgina = User.create!({facebook_id: 1032810096, first_name: "Georgina", last_name: "Oram", email: "georginaoram@gmail.com", picture: "https://scontent-sjc2-1.xx.fbcdn.net/hphotos-xpa1/v/t1.0-9/1467405_10204125254384935_1635893684827349472_n.jpg?oh=fec10dc96c96c0c920d996ff6b99ba01&oe=55E6CB78", friends: georgina_friends })
# miranda = User.create!({facebook_id: 1032810162, first_name: "Miranda", last_name: "Carson", email: "mwcarson90@gmail.com", picture: "https://scontent-sjc2-1.xx.fbcdn.net/hphotos-xfp1/v/t1.0-9/1902876_10202790240290417_5601394013229330544_n.jpg?oh=1d314a714ed5eb3f44cfd838b8ecff0e&oe=560287FD", friends: miranda_friends })

berlin = City.create!({city: "Berlin", country: "Germany"})
sf = City.create!({city: "San Francisco", country: "USA"})
ny = City.create!({city: "New York", country: "USA"})
tokyo = City.create!({city: "Tokyo", country: "Japan"})

food = Category.create!({title: "Food"})
nightlife = Category.create!({title: "Nightlife"})
culture = Category.create!({title: "Culture"})
nature = Category.create!({title: "Nature"})
misc = Category.create!({title: "Misc."})

t1 = Tip.create!({user_id: 13, city_id: berlin.id, category_id: misc.id, content: "Buy a bottle of Rotkaeppchen prosecco (a vestige of the GDR) and sit on the canal"})
t2 = Tip.create!({user_id: 13, city_id: sf.id, category_id: food.id, content: "Philz original on 24th and folsome"})
t3 = Tip.create!({user_id: 13, city_id: sf.id, category_id: misc.id, content: "Rare device in nopa. It's a fun shop"})
t4 = Tip.create!({user_id: 13, city_id: berlin.id, category_id: culture.id, content: "There's an abandoned amusement park in Neukoelln called Spreepark. You can easily slip through the fence to explore"})

Favorite.create!({user_id: 13, tip_id: t2.id})
Favorite.create!({user_id: 13, tip_id: t1.id})
Favorite.create!({user_id: 13, tip_id: t3.id})







