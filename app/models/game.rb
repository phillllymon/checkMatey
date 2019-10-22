class Game < ApplicationRecord

    belongs_to :player_black,
    foreign_key: :player_black_id,
    class_name: :User

    belongs_to :player_white,
    foreign_key: :player_white_id,
    class_name: :User

end