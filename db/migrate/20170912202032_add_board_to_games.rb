class AddBoardToGames < ActiveRecord::Migration[5.0]
  def change
    add_column :games, :board, :string, array:true, default: [nil, nil, nil, nil, nil, nil, nil, nil, nil]
  end
end
