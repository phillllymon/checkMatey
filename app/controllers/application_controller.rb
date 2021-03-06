class ApplicationController < ActionController::Base

    helper_method :logged_in?, :current_user

    def current_user
        User.find_by(session_token: session[:session_token])
    end

    def require_logged_in
        if !logged_in?
            render json: 'what you up to?', status: 401
        end
    end

    def login(user)
        session[:session_token] = user.reset_session_token
        current_user.set_logout_status(false)
    end

    def logout
        current_user.set_logout_status(true)
        current_user.reset_session_token
        session[:session_token] = nil
    end

    def logged_in?
        !!current_user
    end

end
