class Api::GamesController < ApplicationController

    def create
        new_game_params = {
            player_white_id: User.find_by(username: game_params[:player_white]).id,
            player_black_id: User.find_by(username: game_params[:player_black]).id,
            moves: game_params[:moves],
            winner: game_params[:winner],
            ending: game_params[:ending],
        }
        @game = Game.new(new_game_params)
        if @game.save
            render json: 'game saved'
        else
            render json: @game.errors.full_messages, status: 422
        end
    end

    def show
        
        games = Game.all.includes(:player_white, :player_black)
        # debugger
        @games = games.select { |game| game.player_white_id.to_s == params[:id] || game.player_black_id.to_s == params[:id]}
        render :show
    end

    private

    def game_params
        params.require(:game).permit(:player_white, :player_black, :moves, :winner, :ending)
    end

end