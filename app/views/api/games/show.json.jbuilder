@games.each do |game|
    json.set! game.id do
        json.extract! game,
        :id,
        :player_white,
        :player_black,
        :moves,
        :winner,
        :ending,
        :created_at
    end
end