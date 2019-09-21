class Api::ScoresController < ApplicationController

    def index
        scores = Score.all
        highscore = scores[0]
        i = 0
        until highscore.score
            i += 1
            highscore = scores[i]
        end
        scores.each do |score|
            if score.score && score.score > highscore.score
                highscore = score
            end
        end
        redirect_to api_score_url(highscore)
    end

    def create
        @score = Score.new(score_params)
        if @score.save
            redirect_to api_score_url(@score)
        else
            render json: @score.errors.full_messages, status: 422
        end
    end

    def show
        @score = Score.find_by(id: params[:id])
        if @score
            render :show
        else
            render json: "post not found", status: 404
        end
    end

    private

    def score_params
        params.require(:score).permit(:score, :name)
    end

end
