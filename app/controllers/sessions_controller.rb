class SessionsController < ApplicationController

  def new
    render :new
  end

  def create
    # Make create token request
    token = request_token
    # Get credentials from provider by providing token
    credentials = get_credentials_with(token)
    # Check if user exists. If not, create a user, then log them in
    user = log_in_user_by(credentials)
    # Redirect to homepage
    redirect_to root_path
  end

  def destroy
     session[:user_id] = nil
     redirect_to login_path
  end

  def redirect_uri
    root_url[0..-2] + oauth_callback_path
  end

  def request_token
    response = HTTParty.post "https://www.facebook.com/dialog/oauth", {
      body: {
        :client_id  => 927367780617811,
        :redirect_uri  => redirect_uri,
      :response_type    => "token"
      },
      headers: {
        'Accept' => 'application/json'
      },
      format: :json # parse the response as JSON
      }
    }
    response['access_token']
  end

  def get_credentials_with(token)
    response = HTTParty.get "https://www.facebook.com/connect/login_success.html#
    access_token", {
      headers: {
        'Authorization' => "token #{token}",
        'User-Agent'    => 'request'
      },
      format: :json
      # Return credentials
      return {
        access_token: token,
        facebook_id: response['user_id'],
        first_name: response['first_name'],
        last_name: response['last_name'],
        email: response['email'],
        picture: response['profile_picture']
        # NEED TO ADD FRIENDS
      }
    }
  end

  def log_in_user_by(credentials)
    user = User.find_or_initialize_by({facebook_id: credentials[:user_id]})

    if user.new_record?
      # user.first_name = credentials[:first_name]
      # user.last_name = credentials[:last_name]
      # user.email = credentials[:email]
      # user.picture = credentials[:profile_picture]
      # # NEED TO ADD FRIENDS
      # user.save
    end

    session[:access_token] = credentials[:token]
    session[:user_id] = user.id

    # Return user
    user
  end

end