class CreateFavorites < ActiveRecord::Migration
  def change
    create_table :favorites do |t|
      t.references :user
      t.references :tip

      t.timestamps null: false
    end
  end
end
