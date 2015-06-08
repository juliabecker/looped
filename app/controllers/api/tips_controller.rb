module Api
  class TipsController < ApplicationController

    def index
      if params[:city_id]
        tips = Tip.where({city_id: params[:city_id]})
      else
        tips = Tip.where({user_id: params[:user_id]})
      end
      render json: tips, :include => [:user, :category, :city]
    end
    
    def create
      tip = Tip.create({city_id: params[:city_id], user_id: params[:user_id], category_id: params[:category_id], content: params[:content]})
      tip.save
      render json: tip
    end

    def favorites
      tips = Tip.joins(:favorites).where(favorites: {user_id: session[:user_id]})
      render json: tips, :include => [:user, :category, :city]
    end

  end
end