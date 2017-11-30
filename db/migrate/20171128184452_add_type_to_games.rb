class AddTypeToGames < ActiveRecord::Migration[5.0]
  def change
  	add_column :games, :type, :string
  end
end
