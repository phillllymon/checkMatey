class ChallengesController < ApplicationController

    def create
        @username = params[:username]
        @yourName = params[:yourName]
        @challengeId = params[:challengeId]
        @gameType = params[:gameType]
        @gameTime = params[:gameTime]

        @user = User.find_by(username: @username)
        if !@user
            @user = User.new(username: @username, email: @challengeId.to_s, password: '123456', rating: 1000)
        end
        @user.email = @challengeId.to_s
        login(@user)
        redirect_to root_url
    
    end

end