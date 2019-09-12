class Api::SessionsController < ApplicationController

    def create
        @user = User.find_by_credentials(user_params[:username], user_params[:password])
        if @user
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
        params.require(:user).permit(:username, :password)
    end

end
