class Game < ApplicationRecord
  belongs_to :challenger, class_name: 'User'
  belongs_to :challenged, class_name: 'User'
  validates_presence_of :challenged_id, :challenger_id

  enum status: [ :pending, :active, :completed ]

  before_create :create_board
  after_update :set_winner, if: -> (game) { game.status == "active" }
  after_update :set_active, if: -> (game) { game.status == "pending" }

  def create_board
  end

  def make_move
  end

  def legal_move?
  end

  def set_winner
  end

  def turn
  end

  def users_turn?(user)
    turn == user.id
  end

  def player_1
    challenged.id
  end

  def player_2
    challenger.id
  end

  def users
  	User.where(id: [challenged, challenger])
  end

  def opponent(user)
    user == challenger ? challenged : challenger
  end

  def self.with_opponent(user)
    to_game_and_opponent = ->(game) { { game: game, opponent: game.opponent(user) } }
    games = {}
    subclasses.each do |game_type|
      games[game_type.to_s] = {
        pending: where(type: game_type.to_s).pending.map(&to_game_and_opponent),
        active: where(type: game_type.to_s).active.map(&to_game_and_opponent),
        completed: where(type: game_type.to_s).completed.map(&to_game_and_opponent)
      }
    end
    return games
  end

  def set_active
    update(status: "active")
  end

  #include type in game hash returned from 'render json in games controller'
  def as_json(options={})
    super(options.merge({:methods => :type}))
  end
end
