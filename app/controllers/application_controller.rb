class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  # Helper method makes the method available to the view (we link to it from the sessions new page)
  helper_method :code_uri

  FACEBOOK_CODE_URI = 'https://www.facebook.com/dialog/oauth'

  def current_user
    @current_user ||= User.find_by(id: session[:user_id])
  end

  def logged_in?
    current_user.present?
  end

  # Facebook login redirect path
  def redirect_uri
    root_url[0..-2] + oauth_callback_path
  end

  # Link here to log in with Facebook
  def code_uri
    query_params = "?" + URI.encode_www_form({
      response_type: 'code',
      client_id: FACEBOOK_LOOPED_OAUTH_ID,
      redirect_uri: redirect_uri,
      scope: 'public_profile,user_friends'
    })
    FACEBOOK_CODE_URI + query_params
  end

end
