module Api
  class TipsController < ApplicationController

    def index
      tips = Tip.where({city_id: params[:city_id]})
      render json: tips, :include => :user
    end
    
  end
end