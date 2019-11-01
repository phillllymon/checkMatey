class Api::SessionsController < ApplicationController

    def create
        @user = User.find_by_credentials(user_params[:username], user_params[:password])
        if @user
            if @user.username == 'DemoUser' && user_params[:demo]
                UserMailer.test_email.deliver_later
                if !@user.logged_out 
                    @user = User.find_by_credentials('DemoUser2', '123456')
                end
                if !@user.logged_out 
                    @user = User.find_by_credentials('DemoUser3', '123456')
                end
                if !@user.logged_out 
                    @user = User.find_by_credentials('DemoUser4', '123456')
                end
            end
            login(@user)
            redirect_to api_user_url(@user)
        else
            render json: ["invalid credentials"], status: 422
        end
    end

    def destroy
        if logged_in?
            logout
            render json: {}
        else
            render json: ["no one was logged in"], status: 404
        end
    end

    private

    def user_params
        params.require(:user).permit(:username, :password, :demo)
    end

end
