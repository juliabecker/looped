class User < ActiveRecord::Base
  has_many :tips
  has_many :favorites
  has_many :cities, through: :tips
end
