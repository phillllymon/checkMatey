class Api::UsersController < ApplicationController

    def create
        @user = User.new(user_params)
        @user.rating = 1000
        if @user.save
            login(@user)
            redirect_to api_user_url(@user)
        else
            render json: @user.errors.full_messages, status: 422
        end
    end

    def show
        @user = User.find_by(id: params[:id])
        if @user
            render :show
        else
            render json: "user not found", status: 404
        end
    end

    def destroy
    end

    private

    def user_params
        params.require(:user).permit(:username, :email, :password)
    end

end
