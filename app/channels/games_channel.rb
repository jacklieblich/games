class GamesChannel < ApplicationCable::Channel
	def subscribed
		stream_from "games_for_user: #{current_user.id}"
	end

	def unsubscribed
    # Any cleanup needed when channel is unsubscribed
end
end
