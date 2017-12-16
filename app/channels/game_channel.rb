class GameChannel < ApplicationCable::Channel
  def subscribed
  	game = Game.find(params[:game_id])
    ActionCable.server.broadcast(
		"game_#{game.id}",
		{opponentWatching: true}
	)
    stream_from "game_#{params[:game_id]}"
  end

  def unsubscribed
  	game = Game.find(params[:game_id])
    ActionCable.server.broadcast(
		"game_#{game.id}",
		{opponentWatching: false}
	)
  end
end
