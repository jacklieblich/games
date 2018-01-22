class GamesController < ApplicationController
	before_action :authenticate_user! , only: [:surrender, :create, :index, :update, :im_watching, :nudge]

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
		player_1 = User.find(game.player_1)
		player_2 = User.find(game.player_2)
		render json: {
			board: game.board,
			turn: game.turn,
			winner: game.winner,
			player1: player_1,
			player2: player_2,
			player1Piece: game.color_for_user(game.player_1),
			player2Piece: game.color_for_user(game.player_2),
			player1Record: {wins: player_1.wins, losses: player_1.losses},
			player2Record: {wins: player_2.wins, losses: player_2.losses}
		} 
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
		game = Game.find(params[:game_id])
		SendNudgeEmailJob.perform_later(game.opponent(current_user).id, params[:game_id]) if game.users.include?(current_user)
	end

	def surrender
		game = Game.find(params[:game_id])
		if game.status != "completed" && game.users.include?(current_user)
			opponent_id = game.opponent(current_user).id
			game.update(winner: opponent_id, status:"completed")
			ActionCable.server.broadcast(
				"game_#{game.id}",
				{winner: game.winner}
				)
			broadcast_for_users(game)
		end
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
