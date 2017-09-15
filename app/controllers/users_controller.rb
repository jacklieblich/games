class UsersController < ApplicationController

	def login
		user = User.find_or_create_by(user_params)
		session[:user_id] = user.id
		render json: user.id
	end

	def index
		users = User.where.not(id: session[:user_id])
		render json: users
	end

	def user_params
		params.require(:user).permit(:username, :password)
	end
end
