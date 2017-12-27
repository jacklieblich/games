class Users::OmniauthCallbacksController < Devise::OmniauthCallbacksController
  def facebook
    @user = User.find_for_facebook_oauth(request.env["omniauth.auth"])

    if @user.persisted?
      sign_in(@user)
      redirect_to env['omniauth.origin'] || root_path
    else
      render :status => 401, :json => { :errors => alert }
    end
  end
end