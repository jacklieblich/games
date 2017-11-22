class UsersController < ApplicationController

	def index
		users = User.where.not(id: session[:user_id])
		render json: users
	end
end
