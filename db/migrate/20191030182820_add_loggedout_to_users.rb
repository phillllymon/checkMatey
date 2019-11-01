class AddLoggedoutToUsers < ActiveRecord::Migration[5.2]
  def change
    add_column :users, :logged_out, :boolean, :default => true
  end
end
