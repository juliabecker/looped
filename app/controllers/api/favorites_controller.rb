module Api
  class FavoritesController < ApplicationController

    def index
      favorites = Favorite.all
      render json: favorites, include: :tip
    end

    def create
      favorite = Favorite.create({user_id: params[:user_id], tip_id: params[:tip_id]})
      render json: favorite
    end

  end
end