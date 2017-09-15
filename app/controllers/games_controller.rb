class GamesController < ApplicationController

	def create
		game = Game.create(games_params)
		render json: { game: game, opponent: game.challenged }

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
		render json: {squares: game.board, xIsNext: game.turn == 'X'}
	end

	private

	def games_params
		params[:game][:challenger_id] = session[:user_id]
		params.require(:game).permit(:challenged_id, :challenger_id)
	end

end
