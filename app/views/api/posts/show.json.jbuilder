json.extract! @post, 
    :author_id, 
    :post_type, 
    :content, 
    :game_id, 
    :start_move, 
    :end_move,
    :created_at
json.set! :author, @post.author.username
json.set! :author_rating, @post.author.rating