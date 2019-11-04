class Api::EmailController < ApplicationController

    def create
        UserMailer.challenge_email(
            email_params[:address], 
            email_params[:friendName], 
            email_params[:yourName], 
            email_params[:message],
            email_params[:challengeId],
            email_params[:gameType],
            email_params[:gameTime]).deliver_now
        render json: 'email sent'
    end

    private

    def email_params
        params.require(:email).permit(
            :address, 
            :friendName, 
            :yourName, 
            :message, 
            :challengeId, 
            :gameType,
            :gameTime)
    end

end