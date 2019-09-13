class Api::PostsController < ApplicationController

    def index
        @posts = Post.all
        render :index
    end

    def create
        @post = Post.new(post_params)
        @post.author_id = current_user.id
        if @post.save
            redirect_to api_post_url(@post)
        else
            render json: @post.errors.full_messages, status: 422
        end
    end

    def show
        @post = Post.find_by(id: params[:id])
        if @post
            render :show
        else
            render json: "post not found", status: 404
        end
    end

    def update
    end

    def destroy
        @post = Post.find_by(id: params[:id])
        if @post
            @post.destroy
            render json: @post.id
        else
            render json: "post not found", status: 404
        end
    end

    private

    def post_params
        params.require(:post).permit(:content, :post_type, :game_id, :start_move, :end_move)
    end

end
