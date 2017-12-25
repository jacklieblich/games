class UsersController < ApplicationController

	def index
		users = current_user.opponents_ordered_by_most_played_with_records
		render json: users
	end
end
