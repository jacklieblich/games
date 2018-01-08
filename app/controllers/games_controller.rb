class GamesController < ApplicationController

	def create
		game = game_type.create(games_params)
		if game.errors.any?
			render json: {errorMessage: game.errors}, status: 403
		else
			render json: {gameId: game.id}
			broadcast_for_users(game)
		end
	end

	def index
		render json: games_for_display(current_user)
	end

	def show
		game = Game.find(params[:id])
		render json: {board: game.board, turn: game.turn, player1: game.player_1, winner: game.winner, opponentId: game.opponent(current_user).id} 
	end

	def update
		game = Game.find(params[:game_id])
		game.make_move(params[:location], current_user)
		ActionCable.server.broadcast(
			"game_#{game.id}",
			{board: game.board, turn: game.turn, winner: game.winner, nudgable: true}
			)
		broadcast_for_users(game)
	end

	def get_game_types
		render json: game_types
	end

	def im_watching
		ActionCable.server.broadcast(
			"game_#{params[:game_id]}",
			{isWatching: current_user.id}
			)
	end

	def nudge
		SendNudgeEmailJob.perform_later(params[:user_id], params[:game_id])
	end

	private

	def games_for_display(user)
		active_games = user.active_games
		completed_games = user.completed_games
		return {activeGames: active_games, completedGames: completed_games}
	end

	def broadcast_for_users(game)
		game.users.each do |user|
			ActionCable.server.broadcast("games_for_user: #{user.id}", games_for_display(user))
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
