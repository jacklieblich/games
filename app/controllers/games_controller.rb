class GamesController < ApplicationController

	def create
		game = Game.create(games_params)
		game.users.each do |user|
			ActionCable.server.broadcast("games_for_user: #{user.id}",
				user.games.with_opponent(user)
				)
		end
	end

	def index
		games = current_user.games.with_opponent(current_user)
		render json: games
	end

	def show
		game = Game.find(params[:id])
		render json: game.board
	end

	def update
		game = Game.find(params[:game_id])
		game.make_move(params[:piece], params[:location], current_user.id)
		ActionCable.server.broadcast("game_#{game.id}",
			{squares: game.board, xIsNext: game.turn == 'X'}
			)
		game.users.each do |user|
			ActionCable.server.broadcast("games_for_user: #{user.id}",
				user.games.with_opponent(user)
				)
		end
	end

	private

	def games_params
		params[:game][:challenger_id] = current_user.id
		params.require(:game).permit(:challenged_id, :challenger_id)
	end

end
