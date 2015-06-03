class City < ActiveRecord::Base
  has_many :tips
  has_many :users, through: :tips
  has_many :categories, through: :tips
end
