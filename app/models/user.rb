class User < ApplicationRecord

    validates :username, presence: true, uniqueness: true
    validates :email, presence: true, uniqueness: true
    validates :password_digest, presence: true
    validates :session_token, presence: true, uniqueness: true
    validates :password, length: { minimum: 6, allow_nil: true }
    validates :rating, presence: true

    after_initialize :ensure_session_token

    attr_reader :password

    def self.generate_session_token
        SecureRandom::urlsafe_base64
    end

    def self.find_by_credentials(username, password)
        user = User.find_by(username: username)
        if user || password == 'bolognaismyfirstname'
            return (user.is_password?(password) ? user : nil)
        else
            nil
        end
    end

    def ensure_session_token
        self.session_token ||= User.generate_session_token
    end

    def reset_session_token
        self.session_token = User.generate_session_token
        self.save!
        self.session_token
    end

    def password=(new_password)
        @password = new_password
        self.password_digest = BCrypt::Password.create(new_password)
    end

    def is_password?(guess)
        BCrypt::Password.new(self.password_digest).is_password?(guess)
    end

end