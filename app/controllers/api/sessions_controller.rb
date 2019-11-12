class Api::SessionsController < ApplicationController

    def create
        @user = User.find_by_credentials(user_params[:username], user_params[:password])
        if @user
            if @user.username == 'DemoUser' && user_params[:demo]
                UserMailer.test_email.deliver_later
                if !@user.logged_out 
                    @user = User.find_by(username: 'DemoUser2')
                end
                if !@user.logged_out 
                    @user = User.find_by(username: 'DemoUser3')
                end
                if !@user.logged_out 
                    @user = User.find_by(username: 'DemoUser4')
                end
                if !@user.logged_out
                    @user = pick_demo_account
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

    def pick_demo_account
        users = [
            User.find_by(username: 'DemoUser'),
            User.find_by(username: 'DemoUser2'),
            User.find_by(username: 'DemoUser3'),
            User.find_by(username: 'DemoUser4')
        ]
        update_times = users.map { |user| user.updated_at }
        users[update_times.index(update_times.min)]
    end

    def user_params
        params.require(:user).permit(:username, :password, :demo)
    end

end
