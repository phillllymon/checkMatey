class Api::EmailController < ApplicationController

    def index
        UserMailer.test_email.deliver_now
        render json: 'email sent'
    end

end