include ActionView::Helpers::DateHelper

class Game < ApplicationRecord
  belongs_to :challenger, class_name: 'User'
  belongs_to :challenged, class_name: 'User'
  validates_presence_of :challenged_id, :challenger_id
  validate :no_active_game, on: :create

  enum status: [:active, :completed ]

  scope :ordered_by_latest_activity, -> { order(updated_at: :desc)}

  before_create :create_board, :set_player_1
  after_update :set_winner, if: -> (game) { game.status == "active" }
  after_create :send_challenged_email

  def create_board
  end

  def make_move
  end

  def legal_move?
  end

  def set_winner
  end

  def set_player_1
    self.player_1 = [challenged_id, challenger_id].sample
  end

	def turn
		board.flatten.count{ |spot| spot != nil} % 2 == 0 ? player_1 : player_2
	end

  def users_turn?(user)
    turn == user.id
  end

  def player_2
    users.where.not(id: player_1).first.id
  end

  def users
  	User.where(id: [challenged, challenger])
  end

  def opponent(user)
    user == challenger ? challenged : challenger
  end

  def self.for_display(user)
    to_game_and_opponent = ->(game) { { game: game, opponent: game.opponent(user), time_ago: time_ago_in_words(game.updated_at), turn: game.turn } }
    all.map(&to_game_and_opponent)
  end

  def set_active
    update(status: "active")
  end

  def send_challenged_email
    SendChallengedEmailJob.perform_later(self.challenged_id, self.id)
  end

  def self.games_for_users(user_1, user_2)
    user_1.games & user_2.games
  end

  #include type in game hash returned from 'render json in games controller'
  def as_json(options={})
    super(options.merge({:methods => :type}))
  end

  private

  def no_active_game
    if Game.where(type: type, status: "active", challenged_id: challenged_id, challenger_id: challenger_id).or(Game.where(type: type, status: "active", challenged_id: challenger_id, challenger_id: challenged_id)).count > 0
      errors.add(:challenged_id, "You already have an active game of " + type + " against " + challenged.username + ".")
    end
  end
end

Dir["#{Rails.root}/app/models/games/*.rb"].each do |file|
  require_dependency file
end