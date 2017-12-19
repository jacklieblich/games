class GameChannel < ApplicationCable::Channel
  def subscribed
  	game = Game.find(params[:game_id])
    ActionCable.server.broadcast(
		"game_#{game.id}",
		{isWatching: current_user.id}
	)
    stream_from "game_#{params[:game_id]}"
  end

  def unsubscribed
  	game = Game.find(params[:game_id])
    ActionCable.server.broadcast(
		"game_#{game.id}",
		{stoppedWatching: current_user.id}
	)
  end
end
