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


  # Helper method makes the method available to the view (we link to it from the sessions new page)
  helper_method :code_uri

  FACEBOOK_CODE_URI = 'https://www.facebook.com/dialog/oauth'
  FACEBOOK_TOKEN_URI = 'https://graph.facebook.com/v2.3/oauth/access_token?'
  FACEBOOK_API_URI = 'https://graph.facebook.com/me'

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
      scope: 'public_profile,email,user_friends'
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
    byebug
  end

  def get_credentials_with(token)
    response = HTTParty.get FACEBOOK_API_URI, {
      headers: {
        'Authorization' => "token #{token}",
        'User-Agent'    => 'request'
      },
      format: :json
    }
      # Return credentials - just testing id & first_name for now
    return {
      access_token: token,
      facebook_id: response['id'],
      first_name: response['first_name'],
      # last_name: response['last_name'],
      # email: response['email'],
      # picture: response['picture']
      # NEED TO ADD FRIENDS
    }
  end

  def log_in_user_by(credentials)
    user = User.find_or_initialize_by({facebook_id: credentials[:user_id]})

    if user.new_record?
      user.facebook_id = credentials[:facebook_id]
      user.first_name = credentials[:first_name]
      # user.last_name = credentials[:last_name]
      # user.email = credentials[:email]
      # user.picture = credentials[:picture]
      # # NEED TO ADD FRIENDS
      user.save
    end

    session[:access_token] = credentials[:token]
    session[:user_id] = user.id

    # Return user
    user
  end

end