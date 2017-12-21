class AddPlayer1ToGames < ActiveRecord::Migration[5.0]
  def change
    add_column :games, :player_1, :integer
  end
end
