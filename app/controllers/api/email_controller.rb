class Api::EmailController < ApplicationController

    def create
        UserMailer.challenge_email(
            email_params[:address], 
            email_params[:friendName], 
            email_params[:yourName], 
            email_params[:message]).deliver_now
        render json: 'email sent'
    end

    private

    def email_params
        params.require(:email).permit(:address, :friendName, :yourName, :message)
    end

end