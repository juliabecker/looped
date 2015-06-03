class CreateCities < ActiveRecord::Migration
  def change
    create_table :cities do |t|
      t.string :city
      t.string :country

      t.timestamps null: false
    end
  end
end
