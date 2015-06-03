class CreateTips < ActiveRecord::Migration
  def change
    create_table :tips do |t|
      t.references :city
      t.references :user
      t.references :category
      t.string :content  

      t.timestamps null: false
    end
  end
end
