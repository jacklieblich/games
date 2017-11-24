class GameChannel < ApplicationCable::Channel
  def subscribed
  	p params
    stream_from "game_#{params[:game_id]}"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
