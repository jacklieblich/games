class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
  :recoverable, :rememberable, :trackable, :validatable, :omniauthable, omniauth_providers: %i[facebook]
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

  def self.find_for_facebook_oauth(auth)
  	user = User.where(provider: auth.provider, uid: auth.uid).first
  	unless user
  		# checking if the email from facebook already exists for one of the users
  		user = User.where(email: auth.info.email).first
  		if user
  			user.provider = auth.provider
  			user.uid = auth.uid
  			user.save!
  		else
  			user = User.create(username:auth.extra.raw_info.name,
  				provider:auth.provider,
  				uid:auth.uid,
  				email:auth.info.email,
  				password:Devise.friendly_token[0,20]
  				)
  		end
  	end
  	user
  end

end
