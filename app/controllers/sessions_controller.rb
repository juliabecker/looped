class SessionsController < ApplicationController

  def show
    user = User.find_by({id: session[:user_id]})
    render json: user
  end

  def new
    render :new
  end

  def create
    # Make create token request to FB
    token = request_token
    # Get credentials (name, email, id, pic) from FB by providing token
    credentials = get_credentials_with(token)
    # Get user friends
    friends = get_user_friends_with(token)
    # Check if user exists. If not, create a user, then log them in
    user = log_in_user_by(credentials, friends)
    # Redirect to homepage
    redirect_to root_path
  end

  def destroy
     session[:user_id] = nil
     redirect_to login_path
  end

  # Helper method makes the method available to the view (we link to it from the sessions new page)
  helper_method :code_uri

  FACEBOOK_CODE_URI = 'https://www.facebook.com/dialog/oauth'
  FACEBOOK_TOKEN_URI = 'https://graph.facebook.com/v2.3/oauth/access_token?'
  FACEBOOK_API_URI = 'https://graph.facebook.com/v2.3/me'

  #FACEBOOK_LOOPED_OAUTH_ID
  #FACEBOOK_LOOPED_OAUTH_SECRET

  def redirect_uri
    root_url[0..-2] + oauth_callback_path
  end

  def code_uri
    query_params = "?" + URI.encode_www_form({
      response_type: 'code',
      client_id: FACEBOOK_LOOPED_OAUTH_ID,
      redirect_uri: redirect_uri,
      scope: 'public_profile,user_friends'
    })
    FACEBOOK_CODE_URI + query_params
  end

  def request_token
    query_params = URI.encode_www_form({
        :code => params[:code],
        :client_id  => FACEBOOK_LOOPED_OAUTH_ID,
        :client_secret => FACEBOOK_LOOPED_OAUTH_SECRET,
        :redirect_uri  => redirect_uri,
        :response_type => 'token'
      })
    response = HTTParty.post FACEBOOK_TOKEN_URI + query_params
    response['access_token']
  end

  def get_credentials_with(token)
    query_params = URI.encode_www_form({
      fields: 'id,name,picture'
    })
    response = HTTParty.get FACEBOOK_API_URI + "?" + query_params, {
      headers: {
        'Authorization' => "OAuth #{token}",
        'User-Agent'    => 'request'
      },
      format: :json
    }
    return {
      access_token: token,
      facebook_id: response['id'],
      name: response['name'],
      picture: response['picture']['data']['url']
    }
  end

  def get_user_friends_with(token)
    response = HTTParty.get FACEBOOK_API_URI + "/friends", {
      headers: {
        'Authorization' => "OAuth #{token}",
        'User-Agent'    => 'request'
      },
      format: :json
    }
    return {
      friends: response['data']
    }
  end

  def log_in_user_by(credentials,friends)
    user = User.find_or_initialize_by({facebook_id: credentials[:facebook_id]})

    if user.new_record?
      user.facebook_id = credentials[:facebook_id]
      user.name = credentials[:name]
      user.picture = credentials[:picture]
      user.friends = friends[:friends]
      user.save
      # NEED TO ADD LOGIC TO UPDATE FRIENDS AS WELL
    end

    session[:access_token] = credentials[:token]
    session[:user_id] = user.id

    # Return user
    user
  end

end