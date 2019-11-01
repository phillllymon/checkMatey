# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2019_10_30_182820) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "games", force: :cascade do |t|
    t.integer "player_white_id", null: false
    t.integer "player_black_id", null: false
    t.text "moves", null: false
    t.string "winner"
    t.string "ending", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["player_black_id"], name: "index_games_on_player_black_id"
    t.index ["player_white_id"], name: "index_games_on_player_white_id"
  end

  create_table "posts", force: :cascade do |t|
    t.integer "author_id", null: false
    t.string "post_type", null: false
    t.text "content", null: false
    t.integer "game_id"
    t.integer "start_move"
    t.integer "end_move"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["author_id"], name: "index_posts_on_author_id"
  end

  create_table "scores", force: :cascade do |t|
    t.integer "score"
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "users", force: :cascade do |t|
    t.string "username", null: false
    t.string "email", null: false
    t.integer "rating", null: false
    t.string "password_digest", null: false
    t.string "session_token", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.boolean "logged_out", default: true
    t.index ["session_token"], name: "index_users_on_session_token", unique: true
    t.index ["username"], name: "index_users_on_username", unique: true
  end

end
