class RemoveExtraColumnsFromUsers < ActiveRecord::Migration[5.0]
  def change
    remove_column :users, :password, :string
    remove_column :users, :wins, :integer
    remove_column :users, :losses, :integer
  end
end
