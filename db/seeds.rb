# Demo login (see login_form.jsx#demoLogin and Api::SessionsController#create)
# always authenticates as 'DemoUser'/'123456', then rotates through
# DemoUser2-4 if that account is already in use by another visitor.
%w[DemoUser DemoUser2 DemoUser3 DemoUser4].each do |username|
  User.find_or_create_by!(username: username) do |user|
    user.email = "#{username.downcase}@checkmatey.example"
    user.password = '123456'
    user.rating = 1200
  end
end
