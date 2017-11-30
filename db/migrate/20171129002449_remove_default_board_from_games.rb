class RemoveDefaultBoardFromGames < ActiveRecord::Migration[5.0]
  def change
  	change_column_default(:games, :board, nil)
  end
end
