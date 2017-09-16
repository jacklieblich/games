class Game < ApplicationRecord
  belongs_to :challenger, class_name: 'User'
  belongs_to :challenged, class_name: 'User'

  enum status: [ :pending, :active, :completed ]

  scope :pending, -> { where(status: 'pending') }
  scope :active, -> { where(status: 'active') }
  scope :completed, -> { where(status: 'completed')}

  after_update :set_winner, :unless => "winner"
  after_update :set_active, if: ->(game){game.status == "pending"}

  def users
  	User.where(id: [challenged, challenger])
  end

  def opponent(user)
    user == challenger ? challenged : challenger
  end

  def self.with_opponent(user)
    to_game_and_opponent = ->(game) { { game: game, opponent: game.opponent(user) } }
    {
      pending: pending.map(&to_game_and_opponent),
      active: active.map(&to_game_and_opponent),
      completed: completed.map(&to_game_and_opponent)
    }
  end

  def make_move(piece, location, user_id)
    if piece == turn && player(piece).id == user_id && board[location] == nil
      board[location] = piece
      update(board: board)
    end
  end

  def turn
    board.count{ |spot| spot != nil} % 2 == 0 ? 'X' : 'O'
  end

  def set_winner
    lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ]
    lines.size.times do |i|
      a, b, c = lines[i]
      if board[a] && board[a] == board[b] && board[a] == board[c]
        self.update(winner: player(board[a]).id , status:"completed")
      end
    end
  end

  def set_active
    update(status: "active")
  end

  def player(symbol)
    symbol == 'X' ? challenged : challenger
  end

end
