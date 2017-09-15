class CreateGames < ActiveRecord::Migration[5.0]
  def change
    create_table :games do |t|
      t.references :challenger, foreign_key: { to_table: :users }, on_delete: :cascade
      t.references :challenged, foreign_key: { to_table: :users }, on_delete: :cascade
      t.integer :winner

      t.timestamps
    end
  end
end
