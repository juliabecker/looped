class WelcomeController < ApplicationController
  def index
    if logged_in?
      @user = current_user
      render :index
    else
      redirect_to login_path
    end
  end
end