class Users::OmniauthCallbacksController < Devise::OmniauthCallbacksController
  def facebook
    p "hello"
    @user = User.find_for_facebook_oauth(request.env["omniauth.auth"])

    if @user.persisted?
      sign_in(@user)

      render :status => 200, :json => { user: @user}
    else
      render :status => 401, :json => { :errors => alert }
    end
  end
end