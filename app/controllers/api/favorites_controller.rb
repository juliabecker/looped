module Api
  class FavoritesController < ApplicationController

    def index
      favorites = Favorite.where({user_id: params[:user_id]})
      render json: favorites
    end

    def create
      favorite = Favorite.create({user_id: params[:user_id], tip_id: params[:tip_id]})
      render json: favorite, include: :tip
    end

  end
end