module Api
  class TipsController < ApplicationController

    def index
      tips = Tip.where({city_id: params[:city_id]})
      render json: tips, :include => :user
    end
    
    def create
      tip = Tip.create({city_id: params[:city_id], user_id: params[:user_id], category_id: params[:category_id], content: params[:content]})
      tip.save
      render json: tip
    end
  end
end