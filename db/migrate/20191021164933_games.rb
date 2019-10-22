class Games < ActiveRecord::Migration[5.2]
  def change
    create_table :games do |t|
      t.integer :player_white_id, null: false
      t.integer :player_black_id, null: false
      t.text :moves, null: false
      t.string :winner
      t.string :ending, null: false

      t.timestamps
    end
    add_index :games, :player_white_id
    add_index :games, :player_black_id

  end
end
