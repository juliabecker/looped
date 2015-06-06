module Api
  class FavoritesController < ApplicationController

    def create
      favorite = Favorite.create({user_id: params[:user_id], tip_id: params[:tip_id]})
      render json: favorite
    end

  end
end