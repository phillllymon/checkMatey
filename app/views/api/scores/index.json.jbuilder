@scores.each do |score|
    json.extract! score, 
    :name, 
    :score, 
    :updated_at
end