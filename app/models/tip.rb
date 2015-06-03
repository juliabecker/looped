class Tip < ActiveRecord::Base
  belongs_to :city
  belongs_to :user
  belongs_to :category
end
