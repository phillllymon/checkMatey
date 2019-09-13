class Post < ApplicationRecord

    validates :author_id, presence: true
    validates :content, presence: true
    validates :post_type, presence: true

    belongs_to :author,
    foreign_key: :author_id,
    class_name: :User

    belongs_to :game,
    foreign_key: :game_id,
    class_name: :Game,
    optional: true

end
