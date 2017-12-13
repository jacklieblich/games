class GamesController < ApplicationController

	def create
		game = game_type.create(games_params)
		broadcast_for_users(game)
	end

	def index
		games = current_user.games.with_opponent(current_user)
		render json: games
	end

	def show
		game = Game.find(params[:id])
		render json: {squares: game.board, turn: game.turn, player1: game.player_1} 
	end

	def update
		game = Game.find(params[:game_id])
		game.make_move(params[:location], current_user)
		ActionCable.server.broadcast(
			"game_#{game.id}",
			{squares: game.board, turn: game.turn}
			)
		broadcast_for_users(game)
	end

	def get_game_types
		render json: game_types
	end

	private

	def broadcast_for_users(game)
		game.users.each do |user|
			ActionCable.server.broadcast("games_for_user: #{user.id}", user.games.with_opponent(user))
		end
	end

	def game_types
		Game.subclasses.map(&:to_s)
	end

	def game_type
		params[:game_type].constantize if params[:game_type].in? game_types
	end

	def games_params
		params[:game][:challenger_id] = current_user.id
		params.require(:game).permit(:challenged_id, :challenger_id)
	end

end
