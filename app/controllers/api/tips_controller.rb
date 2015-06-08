module Api
  class TipsController < ApplicationController

    def index
      if params[:city_id]
        tips = Tip.where({city_id: params[:city_id]})
      else
        tips = Tip.where({user_id: params[:user_id]})
      end
      render json: tips, :include => :user
    end
    
    def create
      tip = Tip.create({city_id: params[:city_id], user_id: params[:user_id], category_id: params[:category_id], content: params[:content]})
      tip.save
      render json: tip
    end

    def favorites
      int_id_array = params[:tip_id_array].map(&:to_i)
      tips = Tip.find(int_id_array)  
      render json: tips, :include => :user
    end

  end
end