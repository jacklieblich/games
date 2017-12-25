class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable
	has_many :games_as_challenger, class_name: 'Game', foreign_key: :challenger_id, dependent: :destroy
	has_many :games_as_challenged, class_name: 'Game', foreign_key: :challenged_id, dependent: :destroy

	def games
		games_as_challenged.or(games_as_challenger)
	end

	def active_games
		games.active.ordered_by_latest_activity.for_display(self)
	end

	def completed_games
		games.completed.ordered_by_latest_activity.for_display(self)
	end

	def opponents_ordered_by_most_played_with_records
		opponents = User.where.not(id: self.id).sort_by{ |opponent| Game.games_for_users(self, opponent).count}.reverse
		opponents.map do |opponent|
			games = Game.games_for_users(self, opponent)
			wins = games.select{ |game| game.winner == self.id }.count
			losses = games.select{ |game| game.winner == opponent.id }.count
			ties = games.select{ |game| game.winner == nil && game.status == "completed" }.count
			{user: opponent, record: {wins: wins, losses: losses, ties: ties}}
		end
	end
end
