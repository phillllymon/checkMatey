class CreatePosts < ActiveRecord::Migration[5.2]
  def change
    create_table :posts do |t|
      t.integer :author_id, null: false
      t.string :post_type, null: false
      t.text :content, null: false
      t.integer :game_id
      t.integer :start_move
      t.integer :end_move

      t.timestamps
    end
    add_index :posts, :author_id

  end
end
