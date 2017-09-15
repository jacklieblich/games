class ApplicationController < ActionController::API
	def current_user
		User.find(session[:user_id])
	end
end
