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
end
