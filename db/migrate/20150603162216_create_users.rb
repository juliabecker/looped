class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.string :first_name
      t.string :last_name
      t.integer :facebook_id
      t.string :email
      t.string :picture
      t.json :friends

      t.timestamps null: false
    end
  end
end
